pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh "pwd"
      }
    }

    stage('Test') {
      steps {
        echo 'test'
      }
    }

    stage('Deploy') {
      steps {
        echo 'deploy'
      }
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