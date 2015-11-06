'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope, $timeout) {
    $scope.errorMsg = null;
    $rootScope.verifyMsg = null;
    $rootScope.processMsg = null; // message of sync process
    $scope.posting = false; // Is waitting for sync posting response
    $rootScope.accepted = false; //Authorization was accepted or not

    $scope.fbLogin = function () {
      /**
       * Calling FB.login with required permissions specified
       * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
       */
      ezfb.login(function (res) {
        /**
         * no manual $scope.$apply, I got that handled
         */
        if (res.authResponse) {
          var formData = {
            providerId: 'facebook',         // Get access token from FB sdk login
            accessToken: res.authResponse.accessToken,
            domain: CareGiverEnv.spGroupName
          }
            $auth.authenticate(formData)
              .then(function(){
                console.log('Fb login success, master account has been connected.');
                //$state.go('profile');
              })
              .catch(function(httpResponse){
                $scope.errorMessage = httpResponse.data.message;
              });
        }
      }, {scope: 'email,public_profile'});
    };

    $scope.createContact = function(){
      if (!$user.currentUser.email) return;

      $scope.posting = true;
      $rootScope.processMsg = "Seems this is your first login, let\'s setup contact profile for you, a moment please...";
      var url = CareGiverEnv.server.host + '/contacts';
      var data = {
        "firstName" : $user.currentUser.surname,
        "lastName" : $user.currentUser.givenName,
        "email": $user.currentUser.email
      };
      $http.post(url, data).success(function(response) {
        $user.currentUser.contactId = response.content._id;
        $rootScope.updateSpUser().then(function(){
          $rootScope.processMsg = "Contact profile has been created sucessfully.";

          if (!$user.currentUser.kbAccount) $scope.createKbAccount();
          else {
            $rootScope.getKbAccount().then(function(){
              $scope.verifyingPayment();
            });
          }
        });
      }).error(function(error) {
        $scope.posting = false;
        $rootScope.processMsg = null;
        $rootScope.verifyMsg = ("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error');
      });
    };
    $scope.createKbAccount = function() {
      if (!$user.currentUser.email || !$user.currentUser.contactId) return;

      $scope.posting = true;
      $rootScope.processMsg = "Setting up a Killbill account for you, a moment please...";
      var url = CareGiverEnv.server.host_kb + '/billing/accounts';
      var data = {
        "name": $user.currentUser.fullName,
        "email": $user.currentUser.email,
        "externalKey": $user.currentUser.contactId,
        "currency": "USD"
      };
      $http.post(url, data).success(function() {
        $rootScope.processMsg = "Killbill account has been created sucessfully.";

        $rootScope.getKbAccount().then(function() {
          $rootScope.updateSpUser().then(function(){
            console.log("Update AccountID and tag at current user.kbAccount :" + $user.currentUser.kbAccountId);
            $scope.verifyingPayment();
          });
        });
      }).error(function(error) {
        $scope.posting = false;
        $rootScope.processMsg = null;
        $rootScope.verifyMsg = ("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error');
      });
    };
    $scope.verifyingPayment = function(){
      $scope.posting = false;
      $rootScope.processMsg = null;

      if (!$user.currentUser.stripeToken) {
        $rootScope.processMsg = 'Sucessfully login, let\'s go to set up your payment now...';
        $timeout(function(){ $state.go('profile')}, 3000);
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
      $scope.posting = false;
      $rootScope.accepted = true;

      var user = $user.currentUser;
      var isSameGroup = angular.isDefined(user.groups)
      && angular.isArray(user.groups) && user.groups.length == 1
      && user.groups[0].name === "CG_" + CareGiverEnv.spGroupName;
      if (!isSameGroup){
        $scope.posting = false;
        $rootScope.processMsg = null;
        $rootScope.verifyMsg = "Ouch, incorrect group belongs, please contact administrator to fix this. Automatically logout now..";

        $timeout(function(){
          $rootScope.accepted = false;
          $auth.endSession().then(function(){$state.go('login');});
        },3000);

        return;
      }

      if (!$user.currentUser.contactId)$scope.createContact();//create contact profile based on logged user info
      else if (!$user.currentUser.kbAccount) $scope.createKbAccount(); //create account based on contactId as externalKey
      else {  //Get kbAccountId against contactId as externalKey
        $rootScope.getKbAccount().then(function(){
          $scope.verifyingPayment();
        });
      }

    });
    $scope.$on('$authenticationFailure', function(event, response) {
      $scope.errorMsg = response.data && response.data.message || 'XHR Error';
    });
  });
