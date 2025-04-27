pipeline {
  agent any

  environment {
    DOCKER_HUB_USER = "balu361988"
    IMAGE_NAME = "small"
    IMAGE_TAG = "v${BUILD_NUMBER}"
    FULL_IMAGE_NAME = "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
  }

  stages {
    stage('Build Docker Image') {
      steps {
        script {
          // Build Docker image with no cache
          dockerImage = docker.build("${FULL_IMAGE_NAME}", "--no-cache .")
        }
      }
    }

    stage('Push Docker Image to DockerHub') {
      steps {
        script {
          // Push the Docker image to Docker Hub
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
            dockerImage.push()
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          // Replace the image in the Kubernetes YAML file
          sh '''
            echo "Updating Kubernetes deployment with image ${FULL_IMAGE_NAME}"
            sed -i 's|image: .*|image: '"$FULL_IMAGE_NAME"'|' k8s-deployment.yaml
            kubectl apply -f k8s-deployment.yaml --validate=false
            kubectl rollout status deployment/nodejs-app
          '''
        }
      }
    }
  }
}

