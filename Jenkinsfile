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
                echo ' [*] Done'
            }
        }

        stage('Test') {
            steps {
                echo ' [-] Performing tests...'
                sh 'npm test'
                echo ' [*] Done'
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
                        docker image prune
                    '''
                }
                echo ' [*] Docker image built and pushed'
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
