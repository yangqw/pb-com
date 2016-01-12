angular.module('caregiversComApp')
.factory('Partner', ['$resource', function($resource) {
  var host = CareGiverEnv.server.host
  return $resource(host + '/partners/:id',{id: '@token'},{
    'save':   {method:'PUT'},
  })
}])
