angular.module('caregiversComApp')
.factory('Backup', ['$resource', '$http', function(
  $resource,
  $http
) {
  var host = CareGiverEnv.server.host;
  var host2 = CareGiverEnv.server.host_kb;
  return {
    submitBackup: function (token) {
        $http({

          url : "https://staging-services.caregivers.com/partner-management/backup/request",
          method : 'POST',
          headers : {
                'Access-Control-Allow-Origin': '*',
                'Content-Type' : 'application/json',    
                'Authorization': token
          }
        });
    }
  };
}]);