'use strict';

angular.module('caregiversComApp')
.controller('LoginCtrl', [
  "$scope",
  "$http",
  "$cookies",
  "$user",
  "$state",
  "ezfb",
  "$auth",
  "$q",
  "$rootScope",
  "$timeout",
  "Stormpath",
  "Tenant",
  "translate",
  function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope, $timeout, Stormpath, Tenant, translate) {
    $scope.errorMsg = null;
    $rootScope.verifyMsg = null;
    $rootScope.accepted = false; //Authorization was accepted or not

    if (!$rootScope.isAutoLogin){
      $rootScope.processMsg = null; // message of sync process
      $rootScope.posting = false; // Is waitting for sync posting response
    }else{
      $rootScope.processMsg = 'Authenticating...';
      $rootScope.posting = true;
    }

    if (!$user) return;

    $scope.verifySignupToken = function(token){
      return $http.get(CareGiverEnv.server.host+'/partners/fetch?token='+token);
    };
    $scope.updatePartner = function(data){
      return $http.put(CareGiverEnv.server.host+'/partners/',data);
    };

    $scope.creatStripeAccountOrVerifyAccount = function() {
      console.log("Tag at current user.kbTenant:" + $user.currentUser.kbTenant);
      if (!$user.currentUser.stripeAccountId) $scope.createStripeAccount();
      else if (!$user.currentUser.kbStripe) $scope.configStripe();
      else $scope.verifyingBankAccount();
    }


    $scope.createTenant = function() {
      if (!$user.currentUser.email || !$user.currentUser.partnerId) return;
      Tenant.create($scope.creatStripeAccountOrVerifyAccount);

      $rootScope.posting = true;
      $rootScope.processMsg = "Seems this is your first login, let\'s create a tenant first, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/tenants';
      var config = {
        headers: {'X-Killbill-ApiKey': $user.currentUser.email}
      };
      $http.post(url, {}, config).success(function() {
        $rootScope.processMsg = "Tenant has been created sucessfully.";

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
        $rootScope.posting = false;
        $rootScope.processMsg = null;
        $log.debug(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
        $rootScope.verifyMsg = "Error while creating Killbill Tenants"
      });
    };
    $scope.createStripeAccount = function() {
      $rootScope.posting = true;
      $rootScope.processMsg = "Setting up a stripe account for you, a moment please...";

      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts';
      var body = "managed=true&country=US";
      $http.post(url, body).success(function(response){
        $rootScope.processMsg = "Stripe account has been created sucessfully.";

        $user.currentUser.stripeAccountId = response.id;
        var update_user_url = CareGiverEnv.server.host + '/api/users/update';
        $http.post(update_user_url, $user.currentUser
                  ).success(function(user) {
                    console.log("Tag at current user.stripeAccountId:" + $user.currentUser.stripeAccountId);
                    if (!$user.currentUser.kbStripe) $scope.configStripe();
                    else $scope.verifyingBankAccount();
                  });
      }).error(function(error){
        $rootScope.posting = false;
        $rootScope.processMsg = null;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'))
        $rootScope.verifyMsg = "There is an error when creating stripe account";
      });
    }
    $scope.configStripe = function() {
      if (!$user.currentUser.partnerId || !$user.currentUser.stripeAccountId) return;

      $rootScope.posting = true;
      $rootScope.processMsg = "Config your stripe account to tenant, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/tenants/config-stripe';
      var config = {
        headers: {
          'X-Killbill-ApiKey': $user.currentUser.email,
          'X-Killbill-CreatedBy': 'CG Partners Site',
          'Stripe-Destination': $user.currentUser.stripeAccountId
        }};
        $http.post(url, {}, config).success(function(response){
          $rootScope.processMsg = "Tenant and stripe account have been connected.";

          $user.currentUser.kbStripe = true;
          var update_user_url = CareGiverEnv.server.host + '/api/users/update';
          $http.post(update_user_url, $user.currentUser
                    ).success(function(user) {
                      console.log("Tag at current user.kbStripe:" + $user.currentUser.kbStripe);
                      $scope.verifyingBankAccount();
                    });
        }).error(function(error){
          $rootScope.posting = false;
          $rootScope.processMsg = null;
          console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'))
          $rootScope.verifyMsg = "there is an error when config your strip account to tenant"
        });
    }
    $scope.verifyingBankAccount = function(){
      $rootScope.posting = false;
      $rootScope.processMsg = null;

      if (!$user.currentUser.stripeToken) {
        $rootScope.processMsg = 'Sucessfully login, let\'s go to set up your bank account now...';
        $timeout(function(){ $state.go('profile'); }, 3000);
      }
      else{
        $rootScope.processMsg = 'Sucessfully login, fun time...';
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
      $rootScope.posting = false;
      $rootScope.accepted = true;

      var user = $user.currentUser;
      var isSameGroup = angular.isDefined(user.groups)
      && angular.isArray(user.groups) && user.groups.length == 1
      && user.groups[0].name === CareGiverEnv.spGroupFullName;
      if (!isSameGroup){
        $rootScope.posting = false;
        $rootScope.processMsg = null;
        $rootScope.verifyMsg = "Ouch, incorrect group belongs, please contact administrator to fix this. Automatically logout now..";

        $timeout(function(){
          $rootScope.accepted = false;
          $auth.endSession().then(function(){
            $rootScope.verifyMsg = null;
            $state.go('login');});
        },3000);

        return;
      }

      if (!$user.currentUser.partnerId){
        console.log("Impossible for a partner who does not have a partnerId");
      }
      else{
        if ($rootScope.isAutoLogin){
          $scope.verifySignupToken($user.currentUser.partnerId).then(function(response){
            if (!response || !response.data || !response.data.email
              || !response.data.token || response.data.tokenUsed == true){
                return;
              }

              response.data.tokenUsed = true;
              $scope.updatePartner(response.data).then(function(){
                console.log("Updare partner token used flag to true.");
              });
          }).catch(function(exception){
            if (!exception || exception.status == 406){
              console.log("Partner token already used.");
              return;
            }
          });
        }

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
  }]);
