pipeline {
    agent any

    // Skip the default checkout because the host/agent might not have git configured.
    // We will install git and checkout manually.
    options {
        skipDefaultCheckout(true)
    }

    environment {
        APP_BASE_URL = 'http://localhost:3000'
    }

    stages {
        stage('Setup Environment') {
            steps {
                echo 'Checking for required tools on the server...'
                sh 'git --version'
                sh 'node -v'
                sh 'npm -v'
                sh 'sshpass -V'
            }
        }

        stage('Checkout & Install') {
            steps {
                sh 'git config --global --add safe.directory "*"'

                withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                        if [ -d ".git" ]; then
                            echo "Repo exists, pulling changes..."
                            git remote set-url origin https://${GIT_USER}:${GIT_PASS}@github.com/VilanSiriwardana/AFFrontend.git
                            git fetch origin
                            git reset --hard origin/${BRANCH_NAME}
                        else
                            echo "Cloning repository..."
                            git clone https://${GIT_USER}:${GIT_PASS}@github.com/VilanSiriwardana/AFFrontend.git .
                            git checkout ${BRANCH_NAME}
                        fi
                    """
                }
                
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
                        sh "npm run build"
                    }
                }
            }
        }

        stage('Deploy (SFTP)') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                    branch 'dev'
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'invoiceflow-sftp', usernameVariable: 'SFTP_USER', passwordVariable: 'SFTP_PASS')]) {
                        echo 'Deploying to DirectAdmin via SFTP...'
                        
                        // 1. Remove existing files inside public_html
                        // Use ssh with sshpass to execute remote cleanup
                        sh "sshpass -p '${SFTP_PASS}' ssh -o StrictHostKeyChecking=no ${SFTP_USER}@109.163.225.82 'rm -rf domains/test.invoiceflow.nl/public_html/*'"
                        
                        // 2. Upload contents of build/* to public_html
                        // Use scp with sshpass for recursive upload
                        sh "sshpass -p '${SFTP_PASS}' scp -o StrictHostKeyChecking=no -r build/* ${SFTP_USER}@109.163.225.82:domains/test.invoiceflow.nl/public_html/"
                        
                        echo 'Deployment Successful!'
                    }
                }
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
