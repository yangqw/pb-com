(function(){
  'use strict';

  angular.module('caregiversComApp')
  .controller('NavbarCtrl', NavbarCtrl)


  NavbarCtrl.$inject = [
    "$scope",
    "$http",
    "$location",
    "$rootScope",
    "$cookies",
    "$user",
    "$state",
    "$q",
    "$timeout",
    "Stormpath",
    "$auth",
    "Event",
    "translate",
  ]

  function NavbarCtrl(
    $scope,
    $http,
    $location,
    $rootScope,
    $cookies,
    $user,
    $state,
    $q,
    $timeout,
    Stormpath,
    $auth,
    Event,
    translate
  ){

  // function NavbarCtrl($scope, $http, $location, $rootscope, $cookies, $user, $state, $q, $timeout, stormpath, $auth, event, translate){
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isRegisterOpen = CareGiverEnv.spGroupName == 'FAMILIES';
    $scope.profileTitle = CareGiverEnv.spGroupName == 'FAMILIES' ? 'Profile': 'Billing';

    $scope.isActive = function(route) {
      return RegExp(route).test($location.path());
    };

    /**
     * For Strip Terms Of Services Verification
     */
    $scope.acceptTos = function() {
      $scope.posting = true;
      $scope.acceptStripeToS().then(function(){
        $scope.updateSpUser().then(function(){
          $scope.processMsg = translate.user.terms_of_service.success
          $timeout(function(){$('#term-modal').closeModal();}, 3000);
        });
      });
    }
    $scope.acceptStripeToS = function(){
      var op = $q.defer();
      if (!$user.currentUser.stripeAccountId
        || $user.currentUser.stripeToS === true)
      {op.resolve();return op.promise;}

      $scope.verifyMsg = null;
      $scope.processMsg = translate.stripe.terms_of_service.posting
      var url = CareGiverEnv.server.host_kb +  '/billing/stripe-accounts/'
      + $user.currentUser.stripeAccountId;
      var postData = "tos_acceptance[date]=" + Math.floor(Date.now()/1000)
      + "&&tos_acceptance[ip]=" + $rootScope.location.ip;
      $http.post(url, postData).success(function(response){
        $user.currentUser.stripeToS = true;
        $scope.processMsg = translate.stripe.terms_of_service.success

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        console.log("Error while post " + url + " : " + (error && error.error && error.error.message || 'XHR Error'));
        $scope.verifyMsg = translate.stripe.terms_of_service.error
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
        console.log("Error while post " + url + " : " + error)
        $scope.verifyMsg = translate.user.update.error
        op.reject();
      });

      return op.promise;
    };
    $scope.endSession = function(){

      $auth.endSession().then(function(){
        $state.go('login');
        $(".modal").closeModal();
      }).catch(function(){
        $state.go('login');
        $(".modal").closeModal();
      });
    };

    // theme related functions
    //
    $scope.themeFunc = {};

    /* Toggle Sidebar Fixed / Fluid */
    function toggleSidebar() {
      var $body = $('body');
      if ($body.hasClass('sidebar-show')) $body.removeClass('sidebar-show');
      else $body.addClass('sidebar-show');
    }

    $scope.themeFunc.toggleSidebar = toggleSidebar;


    var accessToken = $cookies.get('access_token');
    var isPartnerDomain = angular.equals(CareGiverEnv.spGroupName, 'PARTNERS');

    Event.on('notification.error', function(event, message){
      $rootScope.verifyMsg = message.message;
    })

    Event.on('notification.info', function(event, message){
      $rootScope.processMsg = message.message;
    })

    //
    //
    Event.on('application.authorized', function() {
      $user.get().then(function(user){
        //console.log('The current user is', user);
        if (angular.equals(CareGiverEnv.spGroupName, 'PARTNERS')){
          if ($user.currentUser.stripeAccountId
              && $user.currentUser.stripeToken
            && $user.currentUser.stripeToS === undefined){
              if (angular.equals($state.current.name, "login")){$state.go('main');}
              else {$("#term-modal").openModal({dismissible: false})}
            }
        }
      }).catch(function(error){
        console.log('Error while getting user ' + (accessToken ? ('with access token: ' + accessToken) : ': '), error);
        $rootScope.$broadcast(STORMPATH_CONFIG.NOT_LOGGED_IN_EVENT);
      });
    })
  };
})();
