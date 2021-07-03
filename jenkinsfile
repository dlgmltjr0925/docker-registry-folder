pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
        sh "docker build . -t dlgmltjr0925/docker-registry-folder:0.1.0"
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