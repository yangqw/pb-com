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
    "api_design":{
      "LIST_ENDPOINT": '/default/List',
      "GDN_ENDPOINT": '/default/GDN?GDN=',
      "UPDATE_ENDPOINT": '/default/update',
      "REGISTER_ENDPOINT": '/default/ANNEXJ.REGISTER_DESIGN',
    },
    "api_file":{
      "UPLOAD_ENDPOINT": '/default/upload',
      "ATTACHMENT_ENDPOINT": '/default/attachment?SessionID=',
      "GENERATE_DES_ENDPOINT": '/default/ANNEXJ.GENERATE_DES?URL=',
    },
    "host": "http://localhost:9100",//"https://staging-services.caregivers.com",
    "host_kb": "https://gw.caregivers.com",
    "host_gw": "https://api.caregivers.com/stage/v1",

    "host_pb": "http://resource-dev.taipingcarpets.com:8282/index.php/api",
    "host_asset_url": "http://resource-dev.taipingcarpets.com:8282",
    "host_asset_path": "C:/PB/www/PB/web",
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
