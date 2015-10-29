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
    "host": "http://localhost:9100",
    "host_kb": "https://gw.caregivers.com" //"https://api.caregivers.com/prod"
  }
}
