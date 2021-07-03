pipeline {
  agent any

  stages {
    stage('Build') {
      echo 'build'
    }

    stage('Test') {
      echo 'test'
    }

    stage('Deploy') {
      echo 'deploy'
    }
  }

  post {
    success {
      echo '[$date] success'
    }

    failure {
      echo '[$date] failure'
    }
  }
}