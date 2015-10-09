window.CareGiverEnv = {
  "server": {
    "accesspoint": {
      "USER_COLLECTION_URI" : '/api/users/register',
      "AUTHENTICATION_ENDPOINT" : '/api/users/oauth/token',
      "DESTROY_SESSION_ENDPOINT" : '/api/users/logout',
      "FORM_CONTENT_TYPE" : 'application/json',
    },
    "host": "http://localhost:9100",//"http://192.168.50.102:9100",
  }
}
