pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Python dependencies...'
                bat 'pip install selenium'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium test suite...'
                bat 'python test.py'
            }
        }

    }

    post {
        success {
            echo 'All tests passed! Build successful.'
        }
        failure {
            echo 'Some tests failed. Check console output above.'
        }
    }
}