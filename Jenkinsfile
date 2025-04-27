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
          // Ensure docker is properly set up and then build the image with no cache
          echo "Building Docker image: ${FULL_IMAGE_NAME}"
          dockerImage = docker.build("${FULL_IMAGE_NAME}", "--no-cache .")
        }
      }
    }

    stage('Push Docker Image to DockerHub') {
      steps {
        script {
          echo "Pushing Docker image to DockerHub: ${FULL_IMAGE_NAME}"
          // Push the Docker image to Docker Hub using the specified credentials
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
            dockerImage.push()
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          echo "Deploying to Kubernetes with image: ${FULL_IMAGE_NAME}"
          // Replace image in Kubernetes YAML
          sh """
            sed -i 's|image: .*|image: ${FULL_IMAGE_NAME}|' k8s-deployment.yaml
            kubectl apply -f k8s-deployment.yaml --validate=false
            kubectl rollout status deployment/nodejs-app
          """
        }
      }
    }
  }
}

