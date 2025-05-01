pipeline {
  agent any

  environment {
    DOCKER_HUB_USER = "balu361988"  // Your Docker Hub username
    IMAGE_NAME = "small-project"    // Your project name
    IMAGE_TAG = "v${BUILD_NUMBER}"  // Tag based on Jenkins build number
    FULL_IMAGE_NAME = "${DOCKER_HUB_USER}/${IMAGE_NAME}:${IMAGE_TAG}"  // Full image name
  }

  stages {
    stage('Checkout Code') {
      steps {
        // Pull the latest code from your repository
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          // Build the Docker image using the Dockerfile in the project
          dockerImage = docker.build("${FULL_IMAGE_NAME}", "--no-cache .")
        }
      }
    }

    stage('Push Docker Image to DockerHub') {
      steps {
        script {
          // Push the built Docker image to Docker Hub
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
            dockerImage.push()
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          // Replace the image in k8s-deployment.yaml with the newly built image
          sh '''
            sed -i 's|image: .*|image: '"$FULL_IMAGE_NAME"'|' k8s-deployment.yaml
            kubectl apply -f k8s-deployment.yaml --validate=false
            kubectl rollout status deployment/small-project
          '''
        }
      }
    }
  }

  post {
    success {
      // Notify success or other actions after the build
      echo "Deployment successful"
    }
    failure {
      // Handle failures, like sending notifications
      echo "Deployment failed"
    }
  }
}

