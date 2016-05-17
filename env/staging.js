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
      "LIST_ENDPOINT": '/design/List',
      "GDN_ENDPOINT": '/design/GDN?GDN=',
      "ID_ENDPOINT": '/design/ID?ID=',
      "UPDATE_ENDPOINT": '/design/update',
      "REGISTER_ENDPOINT": '/design/ANNEXJ.REGISTER_DESIGN',
      "RAW_STRUCTURE_ENDPOINT": '/design/getstructure?SessionID='
    },
    "api_file":{
      "LIST_ENDPOINT": '/file/list',
      "UPLOAD_ENDPOINT": '/file/upload',
      "DELETE_ENDPOINT": '/file/delete?SessionID=',
      "ATTACHMENT_ENDPOINT": '/file/attachment?SessionID=',
      "GENERATE_DES_ENDPOINT": '/file/ANNEXJ.GENERATE_DES?URL=',
      "GENERATE_PAT_ENDPOINT": '/file/ANNEXJ.GENERATE_PAT?URL=',
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
