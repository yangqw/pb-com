'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope, $timeout, Stormpath) {
    $scope.errorMsg = null;
    $scope.verifyMsg = null;
    $scope.processMsg = null; // message of sync process
    $scope.posting = false; // Is waitting for sync posting response
    $scope.accepted = false; //Authorization was accepted or not

    if (!$user) return;

    //if($rootScope.Authorized)
    // $user.get().then(function(user){
    //   Raygun.setUser($user.currentUser.id, false, $user.currentUser.email, $user.currentUser.givenName, $user.currentUser.fullName, $user.currentUser.id);
    //   $rootScope.$broadcast('$authenticated');
    // })
    // .catch(function(error){
    //   $rootScope.$broadcast('$sessionEnd');
    //   $rootScope.$broadcast('$notLoggedin');
    //   return;
    // });

    $scope.createTenant = function() {
      if (!$user.currentUser.email || !$user.currentUser.partnerId) return;

      $scope.posting = true;
      $scope.processMsg = "Seems this is your first login, let\'s create a tenant first, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/tenants';
      var config = {
        headers: {'X-Killbill-ApiKey': $user.currentUser.email}
      };
      $http.post(url, {}, config).success(function() {
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
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.verifyMsg = ("Error while post " + url + " : ") + (error && error.causeMessage || error.message || 'XHR Error');
      });
    };
    $scope.createStripeAccount = function() {
      $scope.posting = true;
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
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.verifyMsg = "Error while post " + url + ":" + (error && error.causeMessage || error.message || 'XHR Error');
      });
    }
    $scope.configStripe = function() {
      if (!$user.currentUser.partnerId || !$user.currentUser.stripeAccountId) return;

      $scope.posting = true;
      $scope.processMsg = "Config your stripe account to tenant, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/tenants/config-stripe';
      var config = {
        headers: {
          'X-Killbill-ApiKey': $user.currentUser.email,
          'X-Killbill-CreatedBy': 'CG Partners Site',
          'Stripe-Destination': $user.currentUser.stripeAccountId
      }};
      $http.post(url, {}, config).success(function(response){
        $scope.processMsg = "Tenant and stripe account have been connected.";

        $user.currentUser.kbStripe = true;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
        ).success(function(user) {
          console.log("Tag at current user.kbStripe:" + $user.currentUser.kbStripe);
          $scope.verifyingBankAccount();
        });
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.verifyMsg = "Error while post " + url + ":" + (error && error.causeMessage || error.message || 'XHR Error');
      });
    }
    $scope.verifyingBankAccount = function(){
      $scope.posting = false;
      $scope.processMsg = null;

      if (!$user.currentUser.stripeToken) {
        $scope.processMsg = 'Sucessfully login, let\'s go to set up your bank account now...';
        $timeout(function(){ $state.go('profile'); }, 3000);
      }
      else{
        $scope.processMsg = 'Sucessfully login, fun time...';
        $timeout(function(){ $state.go('main'); }, 3000);
      }

    };

    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = true;
        $cookies.put('access_token', httpResponse.access_token);
      }
      if (!$user || !$user.currentUser) return;

      Raygun.setUser($user.currentUser.id, false, $user.currentUser.email, $user.currentUser.givenName, $user.currentUser.fullName, $user.currentUser.id);
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
