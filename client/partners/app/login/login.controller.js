'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope) {
    $scope.message = 'Hello, LoginCtrl';

    $scope.createTenant = function() {
      if (!$user.currentUser.email || !$user.currentUser.partnerId) return;

      var register_tenant_url = CareGiverEnv.server.host_kb + '/billing/tenants';
      var tenantData = {
        "apiKey": $user.currentUser.email,
        "apiSecret": $user.currentUser.partnerId,
        "externalKey": $user.currentUser.partnerId
      };
      $http.post(register_tenant_url, tenantData
      ).success(function() {
        $user.currentUser.kbTenant = true;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Tag at current user.kbTenant:" + $user.currentUser.kbTenant);
          if (!$user.currentUser.stripeAccountId) $scope.createStripeAccount();
          else if (!$user.currentUser.kbStripe) $scope.configStripe();
          else if (!$user.currentUser.stripeToken) $state.go('profile');
        });
      }).error(function(error) {
        console.log("Error while post " + register_tenant_url);
      });
    };
    $scope.createStripeAccount = function() {
      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts';
      var body = "managed=true&country=US";
      $http.post(url, body).success(function(response){
        $user.currentUser.stripeAccountId = response.id;

        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Create stripe account for current user.stripeAccountId:" + $user.currentUser.stripeAccountId);
          if (!$user.currentUser.kbStripe) $scope.configStripe();
          else if (!$user.currentUser.stripeToken) $state.go('profile');
        });
      }).error(function(error){
        console.log(error);
      });
    }
    $scope.configStripe = function() {
      if (!$user.currentUser.partnerId || !$user.currentUser.stripeAccountId) return;

      var url = CareGiverEnv.server.host_kb + '/billing/tenants/config-stripe';
      var headers = {headers: {
        'X-Killbill-ApiKey': $user.currentUser.email,
        'X-Killbill-ApiSecret': $user.currentUser.partnerId,
        'X-Killbill-CreatedBy': 'CG Partners Site',
        'Stripe-Destination': $user.currentUser.stripeAccountId
      }};
      $http.post(url, $scope.formModel, headers
      ).success(function(response){
        $user.currentUser.kbStripe = true;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Successfully config strip to partner tenant, and tag at current user.kbStripe:" + $user.currentUser.kbStripe);
          if (!$user.currentUser.stripeToken) $state.go('profile');
        });
      }).error(function(error){
        console.log("Error while post " + url + ":" + error);
      });
    }

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
        console.log("Impossible for a partner who does not have a partnerId");
      }
      else{
        //Check KB Tenant && Stripe profile
        if (!$user.currentUser.kbTenant) $scope.createTenant(); //create Tenant based on partnerId as externalKey
        else if (!$user.currentUser.stripeAccountId) $scope.createStripeAccount(); //create Strip Account for this partner
        else if (!$user.currentUser.kbStripe) $scope.configStripe();
        else if (!$user.currentUser.stripeToken) $state.go('profile');
      }

    });
    $scope.$on('$authenticationFailure', function(event, response) {
      $scope.errorMsg = response.data && response.data.message || 'XHR Error';
    });
  });
