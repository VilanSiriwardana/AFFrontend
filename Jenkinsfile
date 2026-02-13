pipeline {
    agent any

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
                sh 'ssh -V'
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
                    def envFileId = (env.BRANCH_NAME == 'main') ? 'env-file-prod' : 
                                    (env.BRANCH_NAME == 'staging') ? 'env-file-staging' : 'env-file-dev'
                    
                    withCredentials([file(credentialsId: envFileId, variable: 'ENV_FILE')]) {
                        sh 'cp $ENV_FILE .env'
                        sh "npm run build"
                    }
                }
            }
        }

        stage('Deploy (SFTP)') {
            steps {
                script {
                    def remotePath = ""

                    // Strict Branch Validation & Path Selection
                    if (env.BRANCH_NAME == 'main') {
                        remotePath = "domains/prod.invoiceflow.nl/public_html"
                    } else if (env.BRANCH_NAME == 'staging') {
                        remotePath = "domains/staging.invoiceflow.nl/public_html"
                    } else if (env.BRANCH_NAME == 'dev') {
                        remotePath = "domains/test.invoiceflow.nl/public_html"
                    } else {
                        error("Deployment not allowed for branch: ${env.BRANCH_NAME}")
                    }

                    withCredentials([usernamePassword(credentialsId: 'invoiceflow-sftp', usernameVariable: 'SFTP_USER', passwordVariable: 'SFTP_PASS')]) {
                        echo "Deploying branch [${env.BRANCH_NAME}] to [${remotePath}]..."
                        
                        // Navigate to build directory locally so 'put -r .' captures EVERYTHING (incl hidden files)
                        // Note: 'put -r .' is more robust than 'put -r build/*'
                        sh """
                            cd build
                            sshpass -p "${SFTP_PASS}" sftp -o StrictHostKeyChecking=no ${SFTP_USER}@109.163.225.82 <<EOF
                            cd ${remotePath}
                            rm -rf *
                            put -r .
                            bye
EOF
                        """
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
