'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG){
    console.log("********");
    STORMPATH_CONFIG.ENDPOINT_PREFIX = 'http://localhost:9100';
    STORMPATH_CONFIG.AUTHENTICATION_ENDPOINT = '/api/users/oauth/token';
  });
