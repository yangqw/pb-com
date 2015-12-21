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
  },
  killbill: {
    get: {
      posting: "Retrieve your info...",
      success: "Error while getting AccountID from killbill :",
      error: "Can not get killbill account"
    },
    create: {
      posting: "Setting up a Killbill account for you, a moment please...",
      success: "Killbill account has been created sucessfully.",
      error: "There is an error when create killbill"
    }
  },
  payment: {
    notExist: {
      posting: "sucessfully login, let\'s go to set up your payment now..."
    },
    posting: "Sucessfully login, fun time..."
  },
  group: {
    notBelong: "Ouch, incorrect group belongs, please contact administrator to fix this. Automatically logout now.."
  }
}

angular.module('caregiversComApp')
.constant('translate', en)
