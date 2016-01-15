window.CareGiverEnv = {
  "server": {
    "accesspoint": {
      "REGISTER_URI" : '/api/users/register',
      "EMAIL_VERIFICATION_ENDPOINT" : '/api/users/emailVerification',
      "AUTHENTICATION_ENDPOINT" : '/api/users/oauth/token',
      "CURRENT_USER_URI" : '/api/users/current',
      "DESTROY_SESSION_ENDPOINT" : '/api/users/logout',
      "FORGOT_PASSWORD_ENDPOINT" : '/api/users/forget_password',
      "CHANGE_PASSWORD_ENDPOINT" : '/api/users/reset_password',
      "FORM_CONTENT_TYPE" : 'application/json',
    },
    "host": "https://staging-services.caregivers.com",
    "host_kb": "https://gw.caregivers.com",//"http://internal-cg-killbill-production-elb-1051596223.us-east-1.elb.amazonaws.com/billing"
    "host_gw": "https://api.caregivers.com/stage/v1"
  },

  "component":{
    "raygun":{
      "initkey":{
        "FAMILIES": "Q6vaxRitsZoLRvxQ7pKsKw==",
        "PARTNERS": "h0ixr2ghLc+Cg82KiDhQ0g=="
      }
    },
    "stripe":{
      "PUBLISHABLE_KEY": "pk_test_d1aKYweI07SGiH1OUk1Jr10t"
    },
    "ezfb":{
      "APP_ID": "1633212660281900",
      "APP_SECRET": ""
    }
  },

  "isStaging": false
}
