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
                    // Select the correct secret file ID based on the branch
                    def envFileId = (env.BRANCH_NAME == 'main') ? 'env-file-prod' : 
                                    (env.BRANCH_NAME == 'staging') ? 'env-file-staging' : 'env-file-dev'
                    
                    // Inject the Secret File directly as '.env'
                    withCredentials([file(credentialsId: envFileId, variable: 'ENV_FILE')]) {
                        sh 'cp $ENV_FILE .env'
                        
                        // Optional: Append any common non-secret vars if they aren't in the secret file
                        // sh "echo 'REACT_APP_BASE_URL=${APP_BASE_URL}' >> .env"
                        
                        sh "npm run build"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                // Build the production image using the Dockerfile
                // Build the production image using the Dockerfile
                // The .env file created in the previous stage is preserved in the workspace
                // and will be copied into the Docker image by the COPY instruction.
                sh "docker build -t af-frontend ."
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
