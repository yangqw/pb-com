angular.module('caregiversComApp')
.factory('Tenant', ['$rootScope', '$http', '$user', '$log', function($rootScope, $http, $user, $log) {
  var create = function(nextStep) {
    var url = CareGiverEnv.server.host_kb + '/billing/tenants';
    var update_user_url = CareGiverEnv.server.host + '/api/users/update';
    var config = {
      headers: {'X-Killbill-ApiKey': $user.currentUser.email}
    };

    $rootScope.posting = true;
    $rootScope.processMsg = "Seems this is your first login, let\'s create a tenant first, a moment please...";
    $http.post(url, {}, config).success(function() {
      $rootScope.processMsg = "Tenant has been created sucessfully.";

      $user.currentUser.kbTenant = true;
      $http.post(update_user_url, $user.currentUser)
      .success(function(user) {
        nextStep()
        // go create
      });
    }).error(function(error) {
      $rootScope.posting = false;
      $rootScope.processMsg = null;
      $log.debug = ("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error');
      $rootScope.verifyMsg = "Create Tenant Failed"
    });
  }
  return {
    create: create
  }
}])
