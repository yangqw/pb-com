var en = {
  stripe: {
    "terms_of_service": {
      posting: "Accepting strip terms of services...",
      success: "Successfully accepted strip terms of services.",
      error: "Accept stripe terms of service failed"
    }
  },
  user: {
    update: {
      error: "There is an when update user info"
    },
    "terms_of_service": {
      success: "Thanks for your accepting terms of services..."
    }
  }
}

angular.module('caregiversComApp')
.constant('translate', en)
