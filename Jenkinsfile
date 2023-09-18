pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo ' [-] Cloning repository...'
                checkout scm
                echo ' [*] Done'
            }
        }

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
    }

    post {
        success {
            echo ' [*] Success'
        }
        failure {
            echo ' [!] Error'
        }
    }
}
