'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG, ezfbProvider){
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
      if (!CareGiverEnv.spGroupName) CareGiverEnv.spGroupName = 'PARTNERS';

      if (CareGiverEnv.component){
        // Init component of Raygun
        if (CareGiverEnv.component.raygun
        && CareGiverEnv.component.raygun.initkey
        && CareGiverEnv.component.raygun.initkey.PARTNERS
        && Raygun && Raygun.init){
          Raygun.init(CareGiverEnv.component.raygun.initkey.PARTNERS);
        }

        // Init component of Stripe
        if (CareGiverEnv.component.stripe
        && CareGiverEnv.component.stripe.PUBLISHABLE_KEY
        && Stripe && Stripe.setPublishableKey){
          Stripe.setPublishableKey(CareGiverEnv.component.stripe.PUBLISHABLE_KEY);
        }

        // Init component of ezfbProvider
        if (CareGiverEnv.component.ezfb
        && CareGiverEnv.component.ezfb.APP_ID
        && ezfbProvider && ezfbProvider.setInitParams){
          ezfbProvider.setInitParams({
            appId: CareGiverEnv.component.ezfb.APP_ID
          });
        }

      }
    }
  });
