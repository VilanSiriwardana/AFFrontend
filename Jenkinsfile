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
                sh 'sftp -V'
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
                        echo 'Deploying to DirectAdmin via strict SFTP (No Shell Allowed)...'
                        
                        // Use sftp with a heredoc to cd and put files recursively.
                        // sshpass handles the password authentication.
                        sh """
                            sshpass -p "${SFTP_PASS}" sftp -o StrictHostKeyChecking=no ${SFTP_USER}@109.163.225.82 <<EOF
                            cd domains/test.invoiceflow.nl/public_html
                            put -r build/*
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
