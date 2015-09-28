'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG){
    console.log("********1");
    STORMPATH_CONFIG.ENDPOINT_PREFIX = 'http://localhost:9100';
    STORMPATH_CONFIG.AUTHENTICATION_ENDPOINT = '/api/users/oauth/token';
    STORMPATH_CONFIG.DESTROY_SESSION_ENDPOINT = '/api/users/logout';
  });
