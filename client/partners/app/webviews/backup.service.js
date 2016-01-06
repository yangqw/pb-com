angular.module('caregiversComApp')
.factory('Backup', ['$resource', function($resource, token) {
  var host = CareGiverEnv.server.host
  var host2 = CareGiverEnv.server.host_kb
return {
  submitBackup: function (token, backup) {
    return $resource(host2 + '/v1/partner-management/backup/request',{},{
      submit: {
          method: 'POST',
          headers: { 'Autorization': token},
          data: backup
      }

      })
    }
};
}])
