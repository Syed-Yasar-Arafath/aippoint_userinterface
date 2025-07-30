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

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply --validate=false -f k8s-deployment.yaml"
                sh "kubectl apply --validate=false -f k8s-service.yaml"
            }
        }
    }
}
