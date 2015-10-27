'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope, $timeout) {
    $scope.message = 'Hello, LoginCtrl';
    $scope.errorMsg = '';
    $scope.verifyMsg = '';
    $scope.accepted = false;

    if (!$user) return;

    if(!$user.currentUser)
      $user.get().then(function(user){
        $scope.errorMsg = '';
        $scope.accepted = true;
        $scope.verifyingBankAccount();
      }).catch(function(error){});

    $scope.createTenant = function() {
      if (!$user.currentUser.email || !$user.currentUser.partnerId) return;

      $scope.processing = true;
      $scope.processMsg = "Seems this is your first login, let\'s create a tenant first, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/tenants';
      var tenantData = {
        "apiKey": $user.currentUser.email,
        "apiSecret": $user.currentUser.partnerId,
        "externalKey": $user.currentUser.partnerId
      };
      $http.post(url, tenantData).success(function() {
        $scope.processMsg = "Tenant has been created sucessfully.";

        $user.currentUser.kbTenant = true;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Tag at current user.kbTenant:" + $user.currentUser.kbTenant);
          if (!$user.currentUser.stripeAccountId) $scope.createStripeAccount();
          else if (!$user.currentUser.kbStripe) $scope.configStripe();
          else $scope.verifyingBankAccount();
        });
      }).error(function(error) {
        $scope.processing = false;
        $scope.verifyMsg = ("Error while post " + url + " : ") + (error && error.causeMessage || error.message || 'XHR Error');
        console.log($scope.verifyMsg);
      });
    };
    $scope.createStripeAccount = function() {
      $scope.processing = true;
      $scope.processMsg = "Setting up a stripe account for you, a moment please...";

      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts';
      var body = "managed=true&country=US";
      $http.post(url, body).success(function(response){
        $scope.processMsg = "Stripe account has been created sucessfully.";

        $user.currentUser.stripeAccountId = response.id;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Tag at current user.stripeAccountId:" + $user.currentUser.stripeAccountId);
          if (!$user.currentUser.kbStripe) $scope.configStripe();
          else $scope.verifyingBankAccount();
        });
      }).error(function(error){
        $scope.processing = false;
        $scope.verifyMsg = "Error while post " + url + ":" + error;
        console.log($scope.verifyMsg);
      });
    }
    $scope.configStripe = function() {
      if (!$user.currentUser.partnerId || !$user.currentUser.stripeAccountId) return;

      $scope.processing = true;
      $scope.processMsg = "Config your stripe account to tenant, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/tenants/config-stripe';
      var headers = {headers: {
        'X-Killbill-ApiKey': $user.currentUser.email,
        'X-Killbill-ApiSecret': $user.currentUser.partnerId,
        'X-Killbill-CreatedBy': 'CG Partners Site',
        'Stripe-Destination': $user.currentUser.stripeAccountId
      }};
      $http.post(url, $scope.formModel, headers).success(function(response){
        $scope.processMsg = "Tenant and stripe account have been connected.";

        $user.currentUser.kbStripe = true;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Tag at current user.kbStripe:" + $user.currentUser.kbStripe);
          $scope.verifyingBankAccount();
        });
      }).error(function(error){
        $scope.processing = false;
        $scope.verifyMsg = "Error while post " + url + ":" + error;
        console.log($scope.verifyMsg);
      });
    }

    $scope.verifyingBankAccount = function(){
      $scope.processing = false;
      $scope.verified = true;
      $scope.processMsg = '';

      if (!$user.currentUser.stripeToken) {
        $scope.processing = false;
        $scope.acceptedMsg = 'Sucessfully login, let\'s go to set up your bank account now...';
        $timeout(function(){ $state.go('profile')}, 3000);
      }
      else{
        $scope.acceptedMsg = 'Sucessfully login, let\'s go to have fun...';
        $timeout(function(){ $state.go('main'); }, 3000);
      }
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
      $scope.errorMsg = '';
      $scope.posting = false;
      $scope.accepted = true;

      if (!$user.currentUser.partnerId){
        console.log("Impossible for a partner who does not have a partnerId");
      }
      else{
        //Check KB Tenant && Stripe profile
        if (!$user.currentUser.kbTenant) $scope.createTenant(); //create Tenant based on partnerId as externalKey
        else if (!$user.currentUser.stripeAccountId) $scope.createStripeAccount(); //create Strip Account for this partner
        else if (!$user.currentUser.kbStripe) $scope.configStripe();
        else $scope.verifyingBankAccount();
      }

    });
    $scope.$on('$authenticationFailure', function(event, response) {
      $scope.errorMsg = response.data && response.data.message || 'XHR Error';
    });
  });
