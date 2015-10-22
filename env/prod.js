window.CareGiverEnv = {
  "server": {
    "accesspoint": {
      //"USER_COLLECTION_URI" : '/api/users/register',
      "REGISTER_URI" : '/api/users/register',
      "EMAIL_VERIFICATION_ENDPOINT" : '/api/users/emailVerification',
      "AUTHENTICATION_ENDPOINT" : '/api/users/oauth/token',
      "CURRENT_USER_URI" : '/api/users/current',
      "DESTROY_SESSION_ENDPOINT" : '/api/users/logout',
      "FORGOT_PASSWORD_ENDPOINT" : '/api/users/forget_password',
      "CHANGE_PASSWORD_ENDPOINT" : '/api/users/reset_password',
      "FORM_CONTENT_TYPE" : 'application/json',
    },
    "host": "https://api-proxy.caregivers.com",
    "host_kb": "https://api.caregivers.com/prod"//"http://internal-cg-killbill-production-elb-1051596223.us-east-1.elb.amazonaws.com/billing"
  }
}
