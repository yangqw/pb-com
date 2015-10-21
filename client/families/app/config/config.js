'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG){
    //console.log("********AppConfig********");
    if (CareGiverEnv) {
      // Overwrite STORMPATH_CONFIG keys if found definition at GareGiverEnv
      if (CareGiverEnv.server){
        if (CareGiverEnv.server.host) STORMPATH_CONFIG.ENDPOINT_PREFIX = CareGiverEnv.server.host;

        if (CareGiverEnv.server.accesspoint)
          angular.forEach(CareGiverEnv.server.accesspoint, function(value, key) {
            STORMPATH_CONFIG[key] = value;
          });
      }

      // Set strompath group belongs for current subdomain
      if (!CareGiverEnv.spGroupName) CareGiverEnv.spGroupName = 'FAMILIES';
    }
  });
