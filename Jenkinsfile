pipeline {
    agent {
        docker {
            image 'docker:cli'
            label 'built-in || master || Jenkins'
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
                // Securely handle Git operations
                withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                        # Ensure we are in a clean state or handle updates
                        if [ -d ".git" ]; then
                            echo "Repo exists, pulling changes..."
                            # Update remote to use credentials
                            git remote set-url origin https://${GIT_USER}:${GIT_PASS}@github.com/VilanSiriwardana/AFFrontend.git
                            git fetch origin
                            # Reset to the specific branch being built
                            git reset --hard origin/${BRANCH_NAME}
                        else
                            echo "Cloning repository..."
                            git clone https://${GIT_USER}:${GIT_PASS}@github.com/VilanSiriwardana/AFFrontend.git .
                            # Checkout the specific branch being built
                            git checkout ${BRANCH_NAME}
                        fi
                    """
                }
                
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
                script {
                    def apiUrlId = (env.BRANCH_NAME == 'main') ? 'af-backend-api-url-prod' : 'af-backend-api-url-dev'
                    
                    withCredentials([
                        string(credentialsId: apiUrlId, variable: 'API_URL'),
                        string(credentialsId: 'af-countries-api-url', variable: 'COUNTRIES_URL')
                    ]) {
                         sh "REACT_APP_API_BASE_URL=${API_URL} REACT_APP_BASE_URL=${APP_BASE_URL} REACT_APP_REST_COUNTRIES_URL=${COUNTRIES_URL} npm run build"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                // Build the production image using the Dockerfile
                script {
                    def apiUrlId = (env.BRANCH_NAME == 'main') ? 'af-backend-api-url-prod' : 'af-backend-api-url-dev'
                    
                    withCredentials([
                        string(credentialsId: apiUrlId, variable: 'API_URL'),
                        string(credentialsId: 'af-countries-api-url', variable: 'COUNTRIES_URL')
                    ]) {
                        sh """
                            docker build \\
                                --build-arg REACT_APP_API_BASE_URL=${API_URL} \\
                                --build-arg REACT_APP_BASE_URL=${APP_BASE_URL} \\
                                --build-arg REACT_APP_REST_COUNTRIES_URL=${COUNTRIES_URL} \\
                                -t af-frontend .
                        """
                    }
                }
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
