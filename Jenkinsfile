// pipeline {
//     agent any

//     environment {
//         IMAGE_NAME = "aippoint-ui"
//         REGISTRY = "iosysdev"
//         TAG = "latest"
//         DOCKER_USERNAME = "iosysdev"
//         DOCKER_PASSWORD = "Dev45#iosys89\$"
//     }

//     stages {
//         stage('Build Docker Image') {
//             steps {
//                 sh "docker build -t $REGISTRY/$IMAGE_NAME:$TAG ."
//             }
//         }

//         stage('Push Docker Image') {
//             steps {
//                 sh """
//                     echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
//                     docker push $REGISTRY/$IMAGE_NAME:$TAG
//                 """
//             }
//         }

//         stage('Authenticate with GCP') {
//             steps {
//                 withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
//                     sh '''
//                         gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
//                         gcloud config set project deployments-449806
//                         gcloud container clusters get-credentials kubernetes-cluster --region=us-central1
//                     '''
//                 }
//             }
//         }

//         stage('Deploy to Kubernetes') {
//             steps {
//                 sh "kubectl apply --validate=false -f k8s-deployment.yaml"
//                 sh "kubectl apply --validate=false -f k8s-service.yaml"
//             }
//         }
//     }
// }


pipeline {
    agent any

    environment {
        IMAGE_NAME = "aippoint-ui"
        GCR_REGISTRY = "gcr.io/deployments-449806"
        TAG = "${env.BUILD_NUMBER}" // Use build number for unique tagging
        GCP_PROJECT = "deployments-449806"
        CLUSTER_NAME = "kubernetes-cluster"
        CLUSTER_REGION = "us-central1"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image: ${GCR_REGISTRY}/${IMAGE_NAME}:${TAG}"
                    sh "docker build -t ${GCR_REGISTRY}/${IMAGE_NAME}:${TAG} ."
                }
            }
        }

        stage('Authenticate with GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                    script {
                        echo "Authenticating with GCP"
                        sh '''
                            gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                            gcloud config set project $GCP_PROJECT
                            gcloud auth configure-docker gcr.io --quiet
                        '''
                    }
                }
            }
        }

        stage('Push to GCR') {
            steps {
                script {
                    echo "Pushing to GCR: ${GCR_REGISTRY}/${IMAGE_NAME}:${TAG}"
                    sh "docker push ${GCR_REGISTRY}/${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Updating k8s-deployment.yaml with tag: ${TAG}"
                    sh """
                        sed -i 's|image: gcr.io/deployments-449806/aippoint-ui:.*|image: gcr.io/deployments-449806/aippoint-ui:${TAG}|' k8s-deployment.yaml
                    """
                    echo "Authenticating with Kubernetes cluster: ${CLUSTER_NAME}"
                    sh """
                        gcloud container clusters get-credentials ${CLUSTER_NAME} --region=${CLUSTER_REGION} --project=${GCP_PROJECT}
                        kubectl apply --validate=false -f k8s-deployment.yaml
                        kubectl apply --validate=false -f k8s-service.yaml
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning up Docker images to free space"
                sh "docker rmi ${GCR_REGISTRY}/${IMAGE_NAME}:${TAG} || true"
            }
        }
        success {
            echo "Pipeline completed successfully! Image pushed to ${GCR_REGISTRY}/${IMAGE_NAME}:${TAG} and deployed to Kubernetes."
        }
        failure {
            echo "Pipeline failed. Check the logs for errors."
        }
    }
}