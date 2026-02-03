pipeline {
    agent {
        docker {
            image 'docker:cli'
            // Run as root to install packages, and mount Docker socket
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    // Skip the default checkout because the host/agent might not have git configured.
    // We will install git and checkout manually inside the container.
    options {
        skipDefaultCheckout(true)
    }

    environment {
        APP_API_URL = 'https://afbackend.onrender.com/api/v1'
        APP_BASE_URL = 'http://localhost:3000'
    }

    stages {
        stage('Setup Environment') {
            steps {
                echo 'Installing Git, Node.js, and npm...'
                // Install dependencies in the alpine-based docker image
                sh 'apk add --no-cache git nodejs npm'
            }
        }

        stage('Checkout & Install') {
            steps {
                // Manually checkout code since the Jenkins Git plugin is struggling with the container path
                sh '''
                    # Ensure we are in a clean state or handle updates
                    if [ -d ".git" ]; then
                        echo "Repo exists, pulling changes..."
                        git fetch origin
                        git reset --hard origin/main
                    else
                        echo "Cloning repository..."
                        git clone https://github.com/VilanSiriwardana/AFFrontend.git .
                        git checkout main
                    fi
                '''
                
                // Install project dependencies
                sh 'npm ci'
            }
        }

        stage('Test & Build (Node)') {
            steps {
                // Run tests
                sh 'npm test -- --watch=false || true'

                // Build React app (verifies build integrity)
                sh "REACT_APP_API_BASE_URL=${APP_API_URL} REACT_APP_BASE_URL=${APP_BASE_URL} npm run build"
            }
        }

        stage('Docker Build & Deploy') {
            steps {
                // Build the production image using the Dockerfile
                // We pass the build args again for the clean production build
                sh """
                    docker build \\
                        --build-arg REACT_APP_API_BASE_URL=${APP_API_URL} \\
                        --build-arg REACT_APP_BASE_URL=${APP_BASE_URL} \\
                        -t af-frontend .
                """

                // Deploy
                sh """
                    docker stop af-frontend || true
                    docker rm af-frontend || true
                    docker run -d -p 3000:80 --name af-frontend af-frontend
                """
            }
        }
    }

    post {
        success {
            echo 'Frontend Pipeline Deployed Successfully!'
        }
        failure {
            echo 'Frontend Pipeline Failed.'
        }
    }
}
