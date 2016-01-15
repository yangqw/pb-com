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
    "host_kb": "https://api.caregivers.com/prod",//"http://internal-cg-killbill-production-elb-1051596223.us-east-1.elb.amazonaws.com/billing"
    "host_gw": "https://api.caregivers.com/prod/v1"
  },

  "component":{
    "raygun":{
      "initkey":{
        "FAMILIES": "Q6vaxRitsZoLRvxQ7pKsKw==",
        "PARTNERS": "h0ixr2ghLc+Cg82KiDhQ0g=="
      }
    },
    "stripe":{
      "PUBLISHABLE_KEY": "pk_live_XtSyQqLQb3FiONXaFcRQDN5G"
    },
    "ezfb":{
      "APP_ID": "1633212660281900",
      "APP_SECRET": ""
    }
  }
}
