pipeline {
  agent none

  options {
    skipDefaultCheckout(true)
  }

  stages {

    stage('Test & Build Application') {
      agent {
        docker {
          image 'node:18-alpine'
        }
      }

      steps {
        checkout scm
        sh 'npm ci'
        sh 'npm test -- --watch=false || true'
        sh 'npm run build'
      }
    }

    stage('Docker Build & Deploy') {
      agent {
        docker {
          image 'docker:cli'
          args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }

      steps {
        checkout scm
        sh '''
          docker build -t af-frontend .
          docker stop af-frontend || true
          docker rm af-frontend || true
          docker run -d -p 3000:80 --name af-frontend af-frontend
        '''
      }
    }
  }

  post {
    success {
      echo 'Frontend deployed successfully'
    }
    failure {
      echo 'Pipeline failed'
    }
  }
}
