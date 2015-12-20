(function(){
  'use strict';
  //Base controller, one purpose is going to set access_token to http headers
  //And customize Stormpath broadcast events
  angular.module('caregiversComApp')
  .controller('ApplicationCtrl', ApplicationCtrl)

  ApplicationCtrl.$inject = [
    "$scope",
    "$http",
    "$cookies",
    "$user",
    "$q",
    "$rootScope",
    "$state",
    "Stormpath",
    "$auth",
    "Killbill",
    "Contact",
    "$location",
    "notificationService",
  ]

  function ApplicationCtrl(
    $scope,
    $http,
    $cookies,
    $user,
    $q,
    $rootScope,
    $state,
    Stormpath,
    $auth,
    Killbill,
    Contact,
    $location,
    notificationService
  ) {
    //console.log('ApplicationCtrl')
    $rootScope.Authorized = false;
    $rootScope.debugMode = false;
    $rootScope.location = null;

    var vm = this;

    vm.hasAcckessToken = !!$location.search().accessToken;
    notificationService.error("this is my error")

    /**
     * @rootScope Stormpath listener
     *
     * Once user logout, should clear access_token from http headers and cookies at current domain
     * And stop all interval timers which running at backgroud
     */
    $rootScope.$on('$sessionEnd', function(event, response) {
      $http.defaults.headers.common.Authorization = null;
      $cookies.remove('access_token');

      $user.currentUser = false;
      $rootScope.Authorized = false;
      Stormpath.stopFight();
    });

    /**
     * @rootScope Stormpath listener
     *
     * If any router directive without Loggedin status, just redirect them to login page
     */
    $rootScope.$on('$notLoggedin', function(e){
      $rootScope.Authorized = false;
      if (!angular.equals($state.current.name, "login")
          && !angular.equals($state.current.name, "logout")
        && !angular.equals($state.current.name, "signup")
        && !angular.equals($state.current.name, "register")
        && !$state.current.name.startsWith("headless")
        && !angular.equals($state.current.name, "main")){
          if (!vm.hasAcckessToken) {
            $state.go('login');
          }
        }
    });

    /**
     * @rootScope Stormpath listener
     *
     * If got Loggedin status lost while switching state, simply broadcast events of $sessionEnd && $notLoggedin
     */
    $rootScope.$on('$stateChangeUnauthenticated', function(e, toState, toParams){
      $rootScope.$broadcast('$sessionEnd');
      $rootScope.$broadcast('$notLoggedin');
    });

    /**
     * @rootScope Stormpath listener
     *
     * Onec successfully got user loggedin, continue steps as:
     * 1. Check group belongs against domain: Get user logout if incorrect group
     * 2. For PARTNERS domain, verify Terms of Services: Show modail dialog to ask user accept ToS if necessary
     *    For FAMILIES domain, retrieve contact info and killbill accountId for further process
     * 3. Get user's expires remaining in seconds and trigger Strompath filght for session timeout
     */
    $rootScope.$on('$currentUser', function(e, user){
      $rootScope.Authorized = true;

      var isSameGroup = angular.isDefined(user.groups)
      && angular.isArray(user.groups) && user.groups.length == 1
      && user.groups[0].name === CareGiverEnv.spGroupFullName;
      if (!isSameGroup && !angular.equals($state.current.name, "login")){
        $auth.endSession();
        return;
      }

      if (angular.equals(CareGiverEnv.spGroupName, 'PARTNERS')){
        if (angular.isDefined($user.currentUser.stripeAccountId)
            && angular.isDefined($user.currentUser.stripeToken)
          && angular.isUndefined($user.currentUser.stripeToS)){
            if (angular.equals($state.current.name, "login")){$state.go('main');}
            else {$("#term-modal").openModal({dismissible: false});}
          }
      }

      if(angular.equals(CareGiverEnv.spGroupName, 'FAMILIES')
         && !angular.equals($state.current.name, "login")){
           if ($user.currentUser.contactId && !$user.currentUser.contact){
             Contact.getContact();
           }

           if ($user.currentUser.contactId && !$user.currentUser.kbAccountId){
             Killbill.getKbAccount();
           }
         }

         if (angular.isNumber($user.currentUser.expires_in)){
           var now = parseInt(new Date().getTime() / 1000);
           Stormpath.resetFight($user.currentUser.expires_in - now);
           Stormpath.fight();
         }
    });

    $scope.$on('$viewContentLoaded', function () {
      //pluginsService.init();
      //applicationService.customScroll();
      //applicationService.handlePanelAction();
      $('.nav.nav-sidebar .nav-active').removeClass('nav-active active');
      $('.nav.nav-sidebar .active:not(.nav-parent)').closest('.nav-parent').addClass('nav-active active');

      if($location.$$path == '/' || $location.$$path == '/layout-api'){
        $('.nav.nav-sidebar .nav-parent').removeClass('nav-active active');
        $('.nav.nav-sidebar .nav-parent .children').removeClass('nav-active active');
        if ($('body').hasClass('sidebar-collapsed') && !$('body').hasClass('sidebar-hover')) return;
        if ($('body').hasClass('submenu-hover')) return;
        $('.nav.nav-sidebar .nav-parent .children').slideUp(200);
        $('.nav-sidebar .arrow').removeClass('active');
      }
      if($location.$$path == '/'){
        $('body').addClass('dashboard');
      }
      else{
        $('body').removeClass('dashboard');
      }
      //$.material.init();

      $(document).on('click.card', '.card', function (e) {
        if ($(this).find('.card-reveal').length) {
          if ($(e.target).is($('.card-reveal .card-title')) || $(e.target).is($('.card-reveal .card-title i'))) {
            $(this).find('.card-reveal').velocity(
              {translateY: 0}, {
                duration: 225,
                queue: false,
                easing: 'easeInOutQuad',
                complete: function() { $(this).css({ display: 'none'}) }
              }
            );
          }
          else if ($(e.target).is($('.card .activator')) ||
                   $(e.target).is($('.card .activator i')) ) {
            $(this).find('.card-reveal').css({ display: 'block'}).velocity("stop", false).velocity({translateY: '-100%'}, {duration: 300, queue: false, easing: 'easeInOutQuad'});
          }
        }
      });

    });

    var accessToken = $cookies.get('access_token') || $location.search().accessToken;
    if (accessToken) {
      accessToken = accessToken.replace(/%2E/g, ".")
      $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
      $http.defaults.headers.common.withCredentials = true;
    }

    if (angular.equals(CareGiverEnv.spGroupName, 'PARTNERS')){
      $.get("http://ipinfo.io/json", function(response){
        $rootScope.location = response;
      });
    }
    $user.cachedUserOp = null;
    $user.get().then(function(user){
      Raygun.setUser($user.currentUser.id, false, $user.currentUser.email, $user.currentUser.givenName, $user.currentUser.fullName, $user.currentUser.id);
      $rootScope.$broadcast('$authenticated');
    })
    .catch(function(error){
      $rootScope.$broadcast('$sessionEnd');
      $rootScope.$broadcast('$notLoggedin');
      return;
    });


  }
})()
