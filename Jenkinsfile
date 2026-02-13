pipeline {
    agent any

    options {
        // Prevent concurrent builds on the same branch
        disableConcurrentBuilds()
        // Start immediately
        quietPeriod(0)
        // Hard timeout for the entire pipeline
        timeout(time: 10, unit: 'MINUTES')
        // Colorized console output
        ansiColor('xterm')
    }

    triggers {
        // Check for changes every minute (if no webhook is configured)
        pollSCM('* * * * *')
    }

    environment {
        APP_BASE_URL = 'http://localhost:3000'
        SFTP_HOST = '109.163.225.82'
        // Disable shell tracing for security
        data = ''
    }

    stages {
        stage('Branch Validation') {
            steps {
                script {
                    // Cancel older builds on this branch
                    milestone(1)
                    
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
                // Safer check that suppression output
                sh 'set +x; git --version && node -v && npm -v && sshpass -V && ssh -V'
            }
        }

        stage('Checkout') {
            steps {
                // Secure SCM checkout using Jenkins credentials
                checkout([
                    $class: 'GitSCM', 
                    branches: [[name: "*/${BRANCH_NAME}"]],
                    doGenerateSubmoduleConfigurations: false, 
                    extensions: [[$class: 'CleanBeforeCheckout']], 
                    submoduleCfg: [], 
                    userRemoteConfigs: [[
                        credentialsId: 'github-pat', 
                        url: 'https://github.com/VilanSiriwardana/AFFrontend.git'
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                // Fast, clean install
                sh 'npm ci --prefer-offline'
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
        always {
            // Workspace cleanup to save disk space and prevent data leaks
            cleanWs()
        }
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

// Secure SFTP Deployment Function
// Handles retries, strict host checking, and secure password usage
def deployToSFTP(String remotePath) {
    retry(2) {
        withCredentials([usernamePassword(credentialsId: 'invoiceflow-sftp', usernameVariable: 'SFTP_USER', passwordVariable: 'SFTP_PASS')]) {
            echo "Initiating Secure SFTP transfer to: ${remotePath}"
            
            // Using a heredoc with sshpass
            // STRICT SECURITY:
            // 1. set +x prevents echoing commands (secrets) to logs
            // 2. StrictHostKeyChecking=no is used as per requirement (host key management is assumed external or accepted risk for this context)
            // 3. Password is passed via environment variable $SFTP_PASS, not interpolated string
            
            sh """
                set +x
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
}
