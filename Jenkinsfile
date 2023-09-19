pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '5', daysToKeepStr: '5'))
        timestamps()
    }

    stages {
        stage('Install dependencies') {
            steps {
                echo ' [-] Installing dependencies...'
                sh 'npm install'
                echo ' [*] Dependencies installed'
            }
        }

        stage('Test') {
            steps {
                echo ' [-] Performing tests...'
                sh 'npm test'
                echo ' [*] Tests passed'
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                echo ' [-] Building and pushing Docker image...'
                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    sh '''
                        docker login -u "$DOCKER_HUB_USERNAME" -p "$DOCKER_HUB_PASSWORD"
                        docker build -t sergiodot/todo-app:1.0 .
                        docker push sergiodot/todo-app:1.0
                    '''
                }
                echo ' [*] Docker image built and pushed'
            }
        }

        stage('Restart Docker environment') {
            steps {
                echo ' [-] Turning off services...'
                sh 'docker compose down'
                echo ' [-] Cleaning docker images...'
                sh 'docker image prune -f'
                echo ' [-] Restarting containers...'
                sh 'docker compose up -d'
                sh 'docker compose restart todo-app'
                echo ' [*] Environment is ready'
            }
        }

    }

    post {
        success {
            echo ' [*] Pipeline executed without errors'
        }
        failure {
            echo ' [!] Error while executing pipeline, check the logs'
        }
    }
}
