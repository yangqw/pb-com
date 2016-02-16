window.CareGiverEnv = {
  "server": {
    "accesspoint": {
      "REGISTER_URI" : '/api/users/register',
      "EMAIL_VERIFICATION_ENDPOINT" : '/api/users/emailVerification',
      "AUTHENTICATION_ENDPOINT" : '/api/users/oauth/token',
      "CURRENT_USER_URI" : '/api/users/current',//'/default/ANNEXJ.REGISTER_DESIGN'
      "DESTROY_SESSION_ENDPOINT" : '/api/users/logout',//'/default/ANNEXJ.REGISTER_DESIGN'
      "FORGOT_PASSWORD_ENDPOINT" : '/api/users/forget_password',
      "CHANGE_PASSWORD_ENDPOINT" : '/api/users/reset_password',
      "FORM_CONTENT_TYPE" : 'application/json',
    },
    "host": "http://localhost:9100",
    "host_kb": "https://gw.caregivers.com",
    // "host_pb": "http://resource-dev.taipingcarpets.com:8282/index.php/api",
    // "host_asset_url": "http://resource-dev.taipingcarpets.com:8282",
    // "host_asset_path": "C:/PB/www/PB/web",
    "host_pb": "http://192.168.2.57/index.php/api",
    "host_asset_url": "http://192.168.2.57",
    "host_asset_path": "D:/wwwroot/PB/web",
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
