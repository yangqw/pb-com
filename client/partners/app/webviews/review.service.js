angular.module('caregiversComApp')
.factory('Review', ['$resource', function($resource) {
  var host = CareGiverEnv.server.host
  var host2 = CareGiverEnv.server.host_kb
  return $resource(host + '/reviews/:id',{id: '@_id'},{
    query: {
      method: "GET",
      url: host + '/reviews/professionals/:partnerId',
      isArray: true
    },
    reply: {
      method: "POST",
      url: host + "/reviews/:id/reply"
    },
    submitBackup: {
      method: "POST",
      url: host2 + "/v1/partner-management/backup/request",
       }
  })
}])
