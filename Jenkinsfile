pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        // Optimization: Prevent builds from queuing and waiting for previous runs to finish
        disableConcurrentBuilds()
        // Optimization: Start immediately on push without the default 5s waiting period
        quietPeriod(0)
    }

    environment {
        APP_BASE_URL = 'http://localhost:3000'
        SFTP_HOST = '109.163.225.82'
    }

    stages {
        stage('Branch Validation') {
            steps {
                // Optimization: Newer builds will skip over older ones at this point
                milestone(1)
                script {
                    def allowedBranches = ['main', 'staging', 'dev']
                    if (!allowedBranches.contains(env.BRANCH_NAME)) {
                        currentBuild.result = 'ABORTED'
                        error("Pipeline execution blocked: Branch '${env.BRANCH_NAME}' is not authorized.")
                    }
                    echo "Branch authorized: ${env.BRANCH_NAME}"
                }
            }
        }

        stage('Setup Environment') {
            steps {
                echo 'Checking for required tools...'
                // Consolidated check for faster execution
                sh 'git --version && node -v && npm -v && sshpass -V && ssh -V'
            }
        }

        stage('Checkout & Install') {
            steps {
                sh 'git config --global --add safe.directory "*"'

                withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                        if [ -d ".git" ]; then
                            git remote set-url origin https://${GIT_USER}:${GIT_PASS}@github.com/VilanSiriwardana/AFFrontend.git
                            git fetch origin
                            git reset --hard origin/${BRANCH_NAME}
                        else
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

        stage('Deploy Development') {
            when { branch 'dev' }
            steps {
                script {
                    deployToSFTP("domains/test.invoiceflow.nl/public_html")
                }
            }
        }

        stage('Deploy Staging') {
            when { branch 'staging' }
            steps {
                script {
                    deployToSFTP("domains/staging.invoiceflow.nl/public_html")
                }
            }
        }

        stage('Deploy Production') {
            when { branch 'main' }
            steps {
                script {
                    deployToSFTP("domains/prod.invoiceflow.nl/public_html")
                }
            }
        }
    }

    post {
        success {
            echo "Successfully Deployed ${env.BRANCH_NAME} to ${env.BRANCH_NAME == 'main' ? 'Production' : env.BRANCH_NAME == 'staging' ? 'Staging' : 'Development'}"
        }
        failure {
            echo 'Frontend Pipeline Failed.'
        }
        aborted {
            echo 'Pipeline Aborted due to Branch Security Policy.'
        }
    }
}

// Global helper function for SFTP Deployment
def deployToSFTP(String remotePath) {
    withCredentials([usernamePassword(credentialsId: 'invoiceflow-sftp', usernameVariable: 'SFTP_USER', passwordVariable: 'SFTP_PASS')]) {
        echo "Initiating SFTP transfer to: ${remotePath}"
        sh """
            cd build
            sshpass -p "${SFTP_PASS}" sftp -o StrictHostKeyChecking=no ${SFTP_USER}@${SFTP_HOST} <<EOF
            cd ${remotePath}
            rm -rf *
            put -r .
            bye
EOF
        """
        echo "Deployment to ${remotePath} successful."
    }
}
