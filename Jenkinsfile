pipeline {
    agent {
        docker {
            image 'docker:cli'
            label 'linux'
            // Run as root to install packages, and mount Docker socket. 
            // --entrypoint="" fixes the warning about container startup.
            args '--entrypoint="" -u root -v /var/run/docker.sock:/var/run/docker.sock'
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
                // Fix permission/ownership issue when passing git repo into container
                sh 'git config --global --add safe.directory "*"'

                // Manually checkout code since the Jenkins Git plugin is struggling with the container path
                sh """
                    # Ensure we are in a clean state or handle updates
                    if [ -d ".git" ]; then
                        echo "Repo exists, pulling changes..."
                        git fetch origin
                        # Reset to the specific branch being built
                        git reset --hard origin/${BRANCH_NAME}
                    else
                        echo "Cloning repository..."
                        git clone https://github.com/VilanSiriwardana/AFFrontend.git .
                        # Checkout the specific branch being built
                        git checkout ${BRANCH_NAME}
                    fi
                """
                
                // Install project dependencies
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --ci'
            }
        }

        stage('Build (Node)') {
            steps {
                // Build React app (verifies build integrity)
                sh "REACT_APP_API_BASE_URL=${APP_API_URL} REACT_APP_BASE_URL=${APP_BASE_URL} npm run build"
            }
        }

        stage('Docker Build') {
            steps {
                // Build the production image using the Dockerfile
                // We pass the build args again for the clean production build
                sh """
                    docker build \\
                        --build-arg REACT_APP_API_BASE_URL=${APP_API_URL} \\
                        --build-arg REACT_APP_BASE_URL=${APP_BASE_URL} \\
                        -t af-frontend .
                """
            }
        }

        stage('Deploy Development') {
            when {
                branch 'dev'
            }
            steps {
                sh 'chmod +x deploy.sh'
                sh './deploy.sh dev'
            }
        }

        stage('Deploy Staging') {
            when {
                branch 'staging'
            }
            steps {
                sh 'chmod +x deploy.sh'
                sh './deploy.sh staging'
            }
        }

        stage('Deploy Production') {
            when {
                branch 'main'
            }
            steps {
                sh 'chmod +x deploy.sh'
                sh './deploy.sh prod'
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
