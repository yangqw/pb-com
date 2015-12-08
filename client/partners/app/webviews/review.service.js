angular.module('caregiversComApp')
.factory('Review', ['$resource', function($resource) {
  var host = CareGiverEnv.server.host
  return $resource(host + '/reviews/:id',{id: '@_id'},{
    query: {
      method: "GET",
      url: host + '/reviews/professionals/:partnerId',
      isArray: true
    },
    reply: {
      method: "POST",
      url: host + "/reviews/:id/reply"
    }
  })
}])
