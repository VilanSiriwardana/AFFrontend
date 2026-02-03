pipeline {
    agent none

    environment {
        // defined globally
        IMAGE_NAME = 'af-frontend'
        CONTAINER_NAME = 'af-frontend'
        PORT_MAPPING = '3000:80' // Using 3000 to avoid conflict with Jenkins default port 8080
        
        // App Configurations (Should match your .env or be set in Jenkins Credentials)
        APP_API_URL = 'https://afbackend.onrender.com/api/v1'
        APP_BASE_URL = 'http://localhost:3000'
    }

    triggers {
        // Triggers the build when a change is pushed to GitHub
        // Requires the Jenkins GitHub plugin and a configured Webhook in the repository
        githubPush()
    }

    stages {
        stage('Test & Build Application') {
            agent {
                docker {
                    image 'node:18-alpine'
                    // We run as root to avoid permission issues with workspace in some Jenkins setups, 
                    // though strictly not best practice for security, it is common in simple pipelines.
                    args '-u root' 
                }
            }
            steps {
                echo 'Stage: Install, Test, and Build (Node.js)'
                
                // 1. Install Dependencies
                // npm ci is faster and stricter than npm install (uses lockfile)
                sh 'npm ci'

                // 2. Run Tests
                // --watchAll=false ensures it runs once and exits, suitable for CI
                // CI=true environment variable also works for most Create React Apps
                sh 'CI=true npm run test'

                // 3. Build Application
                // This validates that the app builds correctly before we try to package it
                sh 'npm run build'
            }
        }

        stage('Docker Build & Deploy') {
            agent {
                docker {
                    image 'docker:cli'
                    // Mount the Docker socket to allow the container to control the host Docker daemon
                    // This is "Docker-in-Docker" via socket binding (sibling containers)
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                echo 'Stage: Dockerize and Deploy'

                script {
                    // 1. Build Docker Image
                    // Uses the Dockerfile relative to the workspace root and passes build-time variables
                    sh "docker build --build-arg REACT_APP_API_BASE_URL=${APP_API_URL} --build-arg REACT_APP_BASE_URL=${APP_BASE_URL} -t ${IMAGE_NAME}:latest ."

                    // 2. Stop and Remove Old Container
                    // || true ensures the pipeline doesn't fail if the container doesn't exist yet
                    echo 'Cleaning up old container...'
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"

                    // 3. Deploy New Container
                    // Run in detached mode (-d), map ports, and name the container
                    echo 'Deploying new container...'
                    sh "docker run -d --name ${CONTAINER_NAME} -p ${PORT_MAPPING} ${IMAGE_NAME}:latest"
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace to save space
            cleanWs()
        }
        success {
            echo 'Pipeline successfully executed!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
