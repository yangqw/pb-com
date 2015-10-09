'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG){
    //console.log("********AppConfig********");
    if (CareGiverEnv) {// Overwrite STORMPATH_CONFIG keys if found definition at GareGiverEnv
      STORMPATH_CONFIG.ENDPOINT_PREFIX = CareGiverEnv.server.host;
      angular.forEach(CareGiverEnv.server.accesspoint, function(value, key) {
        STORMPATH_CONFIG[key] = value;
      })
    }
  });
