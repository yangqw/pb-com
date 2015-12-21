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
  },
  contact: {
    posting: "Seems this is your first login, let\'s setup contact profile for you, a moment please...",
    success: "Contact profile has been created sucessfully.",
    error: "There is an error when create contact"


  }
}

angular.module('caregiversComApp')
.constant('translate', en)
