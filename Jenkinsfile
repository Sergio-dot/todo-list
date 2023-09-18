pipeline {
    agent any

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
