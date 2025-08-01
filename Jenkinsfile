pipeline {
    agent any

    environment {
        IMAGE_NAME = "aippoint-ui"
        GCP_PROJECT = "deployments-449806"
        GCR_DOMAIN = "gcr.io"
        IMAGE_TAG = "${new Date().format('yyyyMMddHHmmss')}" 
        CLUSTER_NAME = "kubernetes-cluster"
        CLUSTER_REGION = "us-central1"
        SECRET_NAME = "ENV_PROD"
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

        stage('Fetch Secret and Create Kubernetes Secret') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                    echo "🔐 [DEBUG] Fetching secret from Secret Manager and creating Kubernetes secret"
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                        gcloud config set project $GCP_PROJECT

                        echo "Fetching ENV_PROD secret from GCP Secret Manager..."
                        gcloud secrets versions access latest --secret=${SECRET_NAME} > .env.production

                        echo "Creating Kubernetes secret 'prod-env' from .env.production..."
                        kubectl create secret generic prod-env \
                          --from-env-file=.env.production \
                          --dry-run=client -o yaml | kubectl apply -f -

                        echo "✅ Kubernetes secret created/updated"
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "🚀 [DEBUG] Deploying to Kubernetes cluster"
                sh '''
                    echo "Updating image tag in k8s-deployment.yaml to ${FULL_IMAGE_NAME}..."
                    sed -i 's|image: gcr.io/${GCP_PROJECT}/${IMAGE_NAME}:.*|image: ${FULL_IMAGE_NAME}|' k8s-deployment.yaml

                    echo "Getting credentials for Kubernetes cluster: ${CLUSTER_NAME}..."
                    gcloud container clusters get-credentials ${CLUSTER_NAME} --region=${CLUSTER_REGION} --project=${GCP_PROJECT}

                    echo "Applying Kubernetes deployment..."
                    kubectl apply --validate=false -f k8s-deployment.yaml

                    echo "Applying Kubernetes service..."
                    kubectl apply --validate=false -f k8s-service.yaml

                    echo "✅ Kubernetes deployment completed"
                '''
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
            echo "✅ [SUCCESS] Pipeline completed successfully! Image pushed to ${FULL_IMAGE_NAME} and deployed to Kubernetes."
        }
        failure {
            echo "❌ [FAILURE] Pipeline failed. Please check the logs above for debugging info."
        }
    }
}
