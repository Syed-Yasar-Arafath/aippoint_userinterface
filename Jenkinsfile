pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_TO_PRODUCTION',
            choices: ['no', 'yes'],
            description: 'Deploy to production? (Select "yes" for production deployment)'
        )
        string(
            name: 'PRODUCTION_IMAGE_TAG',
            defaultValue: 'gcr.io/deployments-449806/aippoint-ui:latest',
            description: 'Image will be selected dynamically during pipeline execution'
        )
    }

    environment {
        IMAGE_NAME = "aippoint-ui"
        GCP_PROJECT = "deployments-449806"
        GCR_DOMAIN = "gcr.io"
        IMAGE_TAG = "${new Date().format('yyyyMMddHHmmss')}"
        CLUSTER_NAME = "kubernetes-cluster"
        PRODUCTION_CLUSTER = "production-cluster"
        CLUSTER_REGION = "us-central1"
        SECRET_NAME = "prod-env"
        FULL_IMAGE_NAME = "gcr.io/${GCP_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}"
    }

    stages {
        stage('Verify Environments') {
            steps {
                echo "🔍 [DEBUG] Verifying environment setup: gcloud, docker, and GCP project"
                sh '''
                    echo "---- gcloud version ----"
                    gcloud --version

                    echo "---- docker version ----"
                    docker --version

                    echo "---- checking gcloud project ----"
                    gcloud config get-value project || echo "No project set"
                '''
            }
        }

        stage('Authenticate with GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                    echo "🔐 [DEBUG] Authenticating with GCP using service account"
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                        gcloud config set project $GCP_PROJECT
                        gcloud auth configure-docker gcr.io --quiet
                        echo "✅ GCP authentication and Docker config successful"
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 [DEBUG] Building Docker image: ${FULL_IMAGE_NAME}"
                sh '''
                    echo "Running docker build..."
                    docker build -t ${FULL_IMAGE_NAME} .
                    echo "✅ Docker image built successfully"
                '''
            }
        }

        stage('Push to GCR') {
            steps {
                echo "📤 [DEBUG] Pushing Docker image to GCR: ${FULL_IMAGE_NAME}"
                sh '''
                    echo "Pushing image to GCR..."
                    docker push ${FULL_IMAGE_NAME}
                    echo "✅ Docker image pushed to GCR"
                '''
            }
        }

        stage('Select Image for Production') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                        echo "📋 [DEBUG] Fetching available images for production deployment"
                        
                        sh '''
                            gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                            gcloud config set project $GCP_PROJECT
                        '''
                        
                        def availableImages = sh(
                            script: "gcloud container images list-tags gcr.io/${GCP_PROJECT}/${IMAGE_NAME} --format=value(tags)",
                            returnStdout: true
                        ).trim().split('\n')
                        
                        echo "📋 Available images for production deployment:"
                        availableImages.eachWithIndex { image, index ->
                            echo "${index + 1}. gcr.io/${GCP_PROJECT}/${IMAGE_NAME}:${image}"
                        }
                        
                        def selectedImage = input(
                            message: 'Select image for production deployment:',
                            parameters: [
                                choice(
                                    name: 'SELECTED_IMAGE',
                                    choices: availableImages,
                                    description: 'Choose the image tag to deploy'
                                )
                            ]
                        )
                        
                        env.SELECTED_IMAGE = selectedImage
                        echo "Selected image: gcr.io/${GCP_PROJECT}/${IMAGE_NAME}:${selectedImage}"
                    }
                }
            }
        }


        stage('Fetch Secret and Create Kubernetes Secret') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                    echo "🔐 [DEBUG] Fetching secret from Secret Manager and creating Kubernetes secret"
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                        gcloud config set project $GCP_PROJECT

                        echo "Fetching prod-env secret from GCP Secret Manager..."
                        gcloud secrets versions access latest --secret=${SECRET_NAME} > .env.production

                        echo "Creating Kubernetes secret 'prod-env' from .env.production..."
                        kubectl create secret generic prod-env \
                          --from-env-file=.env.production \
                          --dry-run=client -o yaml | kubectl apply -f -

                        echo "Creating Docker registry secret for GCR access..."
                        kubectl create secret docker-registry gcr-secret \
                          --docker-server=gcr.io \
                          --docker-username=_json_key \
                          --docker-password="$(cat $GOOGLE_CREDENTIALS)" \
                          --dry-run=client -o yaml | kubectl apply -f -

                        echo "✅ Kubernetes secrets created/updated"
                    '''
                }
            }
        }

        stage('Deploy to Testing (Automatic)') {
            steps {
                echo "🚀 [DEBUG] Deploying to Testing cluster (Automatic)"
                sh '''
                    echo "Updating image tag in backend-deployment.yaml to ${FULL_IMAGE_NAME}..."
                    sed -i "s|image: gcr.io/${GCP_PROJECT}/${IMAGE_NAME}:.*|image: ${FULL_IMAGE_NAME}|" backend-deployment.yaml

                    echo "Getting credentials for Testing Kubernetes cluster: ${CLUSTER_NAME}..."
                    gcloud container clusters get-credentials ${CLUSTER_NAME} --region=${CLUSTER_REGION} --project=${GCP_PROJECT}

                    echo "Applying Kubernetes deployment to Testing..."
                    kubectl apply --validate=false -f backend-deployment.yaml

                    echo "Applying Kubernetes service to Testing..."
                    kubectl apply --validate=false -f backend-service.yaml

                    echo "✅ Testing deployment completed"
                '''
            }
        }



        stage('Select Production Image') {
            when {
                expression { params.DEPLOY_TO_PRODUCTION == 'yes' }
            }
            steps {
                echo "🔍 [DEBUG] Dynamically fetching available images for production deployment"
                script {
                    // Fetch available images dynamically
                    def availableImages = []
                    try {
                        withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                            sh '''
                                gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                                gcloud config set project $GCP_PROJECT
                            '''
                        }
                        
                        def result = sh(
                            script: 'gcloud container images list-tags gcr.io/deployments-449806/aippoint-ui --format="value(tags)"',
                            returnStdout: true
                        ).trim()
                        
                        if (result) {
                            def tags = result.split('\n').collect { it.trim() }.findAll { it && it != '' }
                            availableImages = tags.collect { "gcr.io/deployments-449806/aippoint-ui:${it}" }
                        }
                        
                        if (availableImages.isEmpty()) {
                            availableImages = ['gcr.io/deployments-449806/aippoint-ui:latest']
                        }
                        
                        echo "📋 Available images for production deployment:"
                        availableImages.eachWithIndex { image, index ->
                            echo "${index + 1}. ${image}"
                        }
                        
                        // Use input step to show dropdown with dynamically fetched images
                        def selectedImage = input(
                            message: 'Select image for production deployment',
                            parameters: [
                                choice(
                                    name: 'SELECTED_IMAGE',
                                    choices: availableImages,
                                    description: 'Choose the image to deploy to production'
                                )
                            ]
                        )
                        
                        // Store the selected image for use in deployment
                        env.PRODUCTION_IMAGE_TAG = selectedImage
                        echo "✅ Selected image for production: ${env.PRODUCTION_IMAGE_TAG}"
                        
                    } catch (Exception e) {
                        echo "Error fetching images: ${e.message}"
                        env.PRODUCTION_IMAGE_TAG = 'gcr.io/deployments-449806/aippoint-ui:latest'
                        echo "Using fallback image: ${env.PRODUCTION_IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Production (Manual)') {
            when {
                expression { params.DEPLOY_TO_PRODUCTION == 'yes' }
            }
            steps {
                echo "🚀 [DEBUG] Deploying to Production cluster (Manual)"
                script {
                    def productionImage = env.PRODUCTION_IMAGE_TAG ?: params.PRODUCTION_IMAGE_TAG
                    echo "Production image: ${productionImage}"
                    sh """
                        echo "Updating image tag in backend-deployment.yaml to ${productionImage}..."
                        sed -i "s|image: gcr.io/${GCP_PROJECT}/${IMAGE_NAME}:.*|image: ${productionImage}|" backend-deployment.yaml

                        echo "Getting credentials for Production Kubernetes cluster: ${PRODUCTION_CLUSTER}..."
                        gcloud container clusters get-credentials ${PRODUCTION_CLUSTER} --region=${CLUSTER_REGION} --project=${GCP_PROJECT}

                        echo "Applying Kubernetes deployment to Production..."
                        kubectl apply --validate=false -f backend-deployment.yaml

                        echo "Applying Kubernetes service to Production..."
                        kubectl apply --validate=false -f backend-service.yaml

                        echo "✅ Production deployment completed"
                    """
                }
            }
        }
    }

    post {
        always {
            echo "🧹 [DEBUG] Cleaning up local Docker images"
            sh '''
                echo "Removing local Docker image..."
                docker rmi ${FULL_IMAGE_NAME} || true

                echo "Pruning unused Docker resources..."
                docker system prune -f || true
            '''
        }
        success {
            script {
                if (params.DEPLOY_TO_PRODUCTION == 'yes') {
                    echo "✅ [SUCCESS] Pipeline completed successfully! Deployed to both Testing and Production."
                } else {
                    echo "✅ [SUCCESS] Pipeline completed successfully! Deployed to Testing only."
                }
            }
        }
        failure {
            echo "❌ [FAILURE] Pipeline failed. Please check the logs above for debugging info."
        }
    }
}
