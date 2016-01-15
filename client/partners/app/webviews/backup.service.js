angular.module('caregiversComApp')
.factory('Backup', ['$resource', '$http', function(
  $resource,
  $http
) {
  var host = CareGiverEnv.server.host;
  var host2 = CareGiverEnv.server.host_kb;
  var host3 = CareGiverEnv.server.host_gw;
  return {
    submitBackup: function (token, data) {
      return $http({

        url : host3 + "/partner-management/backup/request",
        method : 'POST',
        data: data,
        headers : {
              'Access-Control-Allow-Origin': '*',
              'Content-Type' : 'application/json',
              'Authorization': token,
              'Access-Control-Allow-Headers':'Content-Type',
              'Access-Control-Allow-Credentials': 'true'
        }
      });
    }
  };
}]);
