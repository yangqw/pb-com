'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG){
    console.log("********1");
    if (CareGiverEnv) {
      STORMPATH_CONFIG.ENDPOINT_PREFIX = CareGiverEnv.server.host;
      angular.forEach(CareGiverEnv.server.accesspoint, function(value, key) {
        STORMPATH_CONFIG[key] = value;
      })
    }
  });
