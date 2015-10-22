'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope) {
    $scope.message = 'Hello, LoginCtrl';

    $scope.postToKillbill = function() {
      if (!$user.currentUser.email || !$user.currentUser.partnerId) return;

      var register_tenant_url = CareGiverEnv.server.host_kb + '/billing/tenants';
      var accountData = {
        "name": $user.currentUser.fullName,
        "email": $user.currentUser.email,
        "externalKey": $user.currentUser.partnerId,
        "currency": "USD"
      };
      $http.post(register_tenant_url, accountData
      ).success(function() {
        $scope.getFromKillbill(
        ).then(function() {
          var update_user_url = CareGiverEnv.server.host + '/api/users/update';
          $http.post(update_user_url, $user.currentUser
          ).success(function(user) {
            console.log("Update TenantId and tag at current user.kbTenant :" + $user.currentUser.kbTenantId);
            $state.go('profile');
          });

        });

      }).error(function(error) {
        console.log("Error while post " + register_tenant_url);
      });
    };
    $scope.getFromKillbill = function() {
      var op = $q.defer();
      if (!$user || !$user.currentUser || !$user.currentUser.partnerId) return op.promise;

      var url = CareGiverEnv.server.host_kb + '/billing/tenants?externalKey=' + $user.currentUser.partnerId;
      $http.get(url).success(function(response){
        if (!response || !response.tenantId){
          console.log("Error while getting TenantId from killbill :" + response.message);
          $user.currentUser.kbTenant = false;
          $user.currentUser.kbTenantId = '';
          op.reject();
        }
        else{
          console.log("Get TenantId from killbill :" + response.tenantId);
          $user.currentUser.kbTenant = true;
          $user.currentUser.kbTenantId = response.tenantId;
        }

        op.resolve();
      }).error(function(error){
        console.log("Error while getFromKillbill " + url);
        op.reject();
      });

      return op.promise;
    };

    $rootScope.$on('$sessionEnd', function(event, response) {
      $http.defaults.headers.common.Authorization = null;
      $cookies.remove('access_token');
      $user.currentUser = false;
    });
    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = true;
        $cookies.put('access_token', httpResponse.access_token);
      }
      if (!$user || !$user.currentUser) return;

      if (!$user.currentUser.partnerId){
        //Impossible for a partner who doesn't have a partnerId.
      }
      else{
        //Check KB Tenant profile
        if (!$user.currentUser.kbTenant) $scope.postToKillbill(); //create Tenant based on partnerId as externalKey
        else {  //Get kbTenantId against partnerId as externalKey
          $scope.getFromKillbill(
          ).then(function(){
            if (!$user.currentUser.stripeToken) $state.go('profile');
          });
        }
      }

    });
    $scope.$on('$authenticationFailure', function(event, response) {
      $scope.errorMsg = response.data && response.data.message || 'XHR Error';
    });
  });
