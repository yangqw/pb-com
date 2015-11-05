'use strict';

angular.module('caregiversComApp')
  .controller('NavbarCtrl', function ($scope, $http, $location, $rootScope, $cookies, $user, $state, $q, $timeout, Stormpath, $auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isRegisterOpen = CareGiverEnv.spGroupName == 'FAMILIES';
    $scope.profileTitle = CareGiverEnv.spGroupName == 'FAMILIES' ? 'Billing': 'Billing';

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    /**
     * For Strip Terms Of Services Verification
     */
    $scope.acceptTos = function() {
      $scope.posting = true;
      $scope.acceptStripeToS().then(function(){
        $scope.updateSpUser().then(function(){
          $scope.processMsg = 'Thanks for your accepting terms of services...';
          $timeout(function(){$('#term-modal').modal('hide');}, 3000);
        });
      });
    }
    $scope.acceptStripeToS = function(){
      var op = $q.defer();
      if (!$user.currentUser.stripeAccountId
        || $user.currentUser.stripeToS === true)
        {op.resolve();return op.promise;}

      $scope.verifyMsg = null;
      $scope.processMsg = 'Accepting strip terms of services...';
      var url = CareGiverEnv.server.host_kb +  '/billing/stripe-accounts/'
        + $user.currentUser.stripeAccountId;
      var postData = "tos_acceptance[date]=" + Math.floor(Date.now()/1000)
        + "&&tos_acceptance[ip]=" + $rootScope.location.ip;
      $http.post(url, postData).success(function(response){
        $user.currentUser.stripeToS = true;
        $scope.processMsg = 'Successfully accepted strip terms of services.';

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.verifyMsg = "Error while post " + url + " : " + (error && error.error && error.error.message || 'XHR Error');

        Raygun.send(new Error($scope.verifyMsg));
        op.reject();
      });

      return op.promise;
    };
    $rootScope.updateSpUser = function(){
      var op = $q.defer();
      if (!$user || !$user.currentUser)
        {op.resolve();return op.promise;}

      $scope.verifyMsg = null;
      var url = CareGiverEnv.server.host + '/api/users/update';
      var postData = $user.currentUser;
      $http.post(url, postData).success(function(response){
        //console.log("Updated current user with stripeToS(" + $user.currentUser.stripeToS + ")");

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.verifyMsg = "Error while post " + url + " : " + error;
        op.reject();
      });

      return op.promise;
    };
    $scope.endSession = function(){

      $auth.endSession().then(function(){
        $state.go('login');
        $(".modal").modal('hide');
        $(".modal-backdrop").remove();
      }).catch(function(){
        $state.go('login');
        $(".modal").modal('hide');
        $(".modal-backdrop").remove();
      });
    };

    var accessToken = $cookies.get('access_token');
    var isPartnerDomain = angular.equals(CareGiverEnv.spGroupName, 'PARTNERS');

    if ($rootScope.Authorized === true) {
      $user.get().then(function(user){
        //console.log('The current user is', user);
        if (angular.equals(CareGiverEnv.spGroupName, 'PARTNERS')){
          if ($user.currentUser.stripeAccountId
          && $user.currentUser.stripeToken
          && $user.currentUser.stripeToS === undefined){
            if (angular.equals($state.current.name, "login")){$state.go('main');}
            else {$("#term-modal").modal({'backdrop': 'static', 'keyboard': false});}
          }
        }
      }).catch(function(error){
        console.log('Error while getting user ' + (accessToken ? ('with access token: ' + accessToken) : ': '), error);
        $rootScope.$broadcast(STORMPATH_CONFIG.NOT_LOGGED_IN_EVENT);
      });
    }
  });
