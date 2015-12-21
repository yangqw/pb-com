'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth, $q, $rootScope, $timeout, Killbill, Contact, Stormpath, translate) {
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
            domain: CareGiverEnv.spGroupName,
            isStaging: CareGiverEnv.isStaging === true
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

    $scope.verifyingPayment = function(){
      $rootScope.posting = false;
      $rootScope.processMsg = null;

      if (!$user.currentUser.stripeToken) {
        $rootScope.processMsg = translate.payment.notExist.posting;
        $timeout(function(){ $state.go('account')}, 3000);
      }
      else{
        $rootScope.processMsg = translate.payment.posting;
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
      && user.groups[0].name === CareGiverEnv.spGroupFullName;;
      if (!isSameGroup){
        $rootScope.posting = false;
        $rootScope.processMsg = null;
        $rootScope.verifyMsg = translate.group.notBelong;

        $timeout(function(){
          $rootScope.accepted = false;
          $auth.endSession().then(function(){
            $rootScope.verifyMsg = null;
            $state.go('login');});
        },3000);

        return;
      }

      Contact.createContact().then(function(){
        Killbill.createKbAccount().then(function(){
          Killbill.getKbAccount().then(function(){
            $scope.verifyingPayment();
          });
        });
      });

    });
    $scope.$on('$authenticationFailure', function(event, response) {
      $scope.errorMsg = response.data && response.data.message || 'XHR Error';
    });
  });
