pipeline {
    agent any

    def dockerImageTag = "" // Dynamic-generated Docker image tag

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
                script {
                    def appVersion = "v1.0.0"
                    def commitHash = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    dockerImageTag = "${appVersion}-${commitHash}"

                    echo " [-] Building and pushing Docker image with tag: ${dockerImageTag}"

                    withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        sh 'docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_PASSWORD'
                        sh "docker build -t sergiodot/todo-app:${dockerImageTag} ."
                        sh "docker push sergiodot/todo-app:${dockerImageTag}"
                    }
                    echo " [*] Docker image built and pushed with tag: ${dockerImageTag}"
                }
            }
        }
    }

    post {
        success {
            script {
                def buildNumber = currentBuild.number
                def green = "#00FF00"
                
                echo " [*] Pipeline executed without errors (Build #${buildNumber})"
                slackSend channel: '#development', message: "Build *#${buildNumber}* succeeded - Image published with tag: ${dockerImageTag}", tokenCredentialId: 'slack-todo-app', color: green
            }
        }
        failure {
            script {
                def buildNumber = currentBuild.number
                def red = "#FA0202"

                echo ' [!] Error while executing pipeline, check the logs'
                slackSend channel: '#development', message: "Build *#${buildNumber}* failed", tokenCredentialId: 'slack-todo-app', color: red
            }
        }
    }
}
