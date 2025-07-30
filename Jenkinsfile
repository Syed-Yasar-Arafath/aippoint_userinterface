pipeline {
    agent any

    environment {
        IMAGE_NAME = "aippoint-ui"
        REGISTRY = "iosysdev"
        TAG = "latest"
        DOCKER_USERNAME = "iosysdev"
        DOCKER_PASSWORD = "Dev45#iosys89\$"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t $REGISTRY/$IMAGE_NAME:$TAG ."
            }
        }

        stage('Push Docker Image') {
            steps {
                sh """
                    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    docker push $REGISTRY/$IMAGE_NAME:$TAG
                """
            }
        }

        stage('Authenticate with GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-key', variable: 'GOOGLE_CREDENTIALS')]) {
                    sh '''
                        gcloud auth activate-service-account --key-file=$GOOGLE_CREDENTIALS
                        gcloud config set project deployments-449806
                        gcloud container clusters get-credentials kubernetes-cluster --region=us-central1
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply --validate=false -f k8s-deployment.yaml"
                sh "kubectl apply --validate=false -f k8s-service.yaml"
            }
        }
    }
}
