'use strict';
//Base controller, one purpose is going to set access_token to http headers
//And customize Stormpath broadcast events
angular.module('caregiversComApp')
  .controller('ApplicationCtrl', function ($scope, $http, $cookies, $user, $q, $rootScope, $state, Stormpath, $auth) {
    $rootScope.Authorized = false;

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
      && !angular.equals($state.current.name, "register")
      && !angular.equals($state.current.name, "main")){
          $state.go('login');
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
      && user.groups[0].name === "CG_" + CareGiverEnv.spGroupName;
      if (!isSameGroup){
        $auth.endSession();
        return;
      }

      if (angular.equals(CareGiverEnv.spGroupName, 'PARTNERS')){
        if (angular.isDefined($user.currentUser.stripeAccountId)
        && angular.isDefined($user.currentUser.stripeToken)
        && angular.isUndefined($user.currentUser.stripeToS)){
          if (angular.equals($state.current.name, "login")){$state.go('main');}
          else {$("#term-modal").modal({'backdrop': 'static', 'keyboard': false});}
        }
      }

      if(angular.equals(CareGiverEnv.spGroupName, 'FAMILIES')){
        if ($user.currentUser.contactId && !$user.currentUser.contact){
          $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
          .success(function(response) {
            if (response && response.content)
              $user.currentUser.contact = response.content;
          });
        }

        if ($user.currentUser.contactId && !$user.currentUser.kbAccountId){
          $rootScope.getKbAccount();
        }
      }

      if (angular.isNumber($user.currentUser.expires_in)){
        var now = parseInt(new Date().getTime() / 1000);
        Stormpath.resetFight($user.currentUser.expires_in - now);
        Stormpath.fight();
      }
    });

    $rootScope.getKbAccount = function() {
      var op = $q.defer();
      if (!$user || !$user.currentUser || !$user.currentUser.contactId) return op.promise;

      $scope.posting = true;
      $scope.processMsg = "Retrieve your info...";
      var url = CareGiverEnv.server.host_kb + '/billing/accounts?externalKey=' + $user.currentUser.contactId;
      $http.get(url).success(function(response){
        if (!response || !response.accountId){
          $user.currentUser.kbAccount = false;
          $user.currentUser.kbAccountId = '';

          $scope.posting = false;
          $scope.processMsg = null;
          $scope.verifyMsg = "Error while getting AccountID from killbill :" + response.message;
          op.reject();
        }
        else{
          console.log("Get AccountID from killbill :" + response.accountId);
          $user.currentUser.kbAccount = true;
          $user.currentUser.kbAccountId = response.accountId;
        }

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.verifyMsg = ("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error');
        op.reject();
      });

      return op.promise;
    };

    var accessToken = $cookies.get('access_token');
    if (accessToken) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
        $http.defaults.headers.common.withCredentials = true;
    }
    $scope.debugMode = false;

    $user.get().then(function(user){
      Raygun.setUser($user.currentUser.id, false, $user.currentUser.email, $user.currentUser.givenName, $user.currentUser.fullName, $user.currentUser.id);
      $rootScope.$broadcast('$authenticated');
    })
    .catch(function(error){
      $rootScope.$broadcast('$sessionEnd');
      $rootScope.$broadcast('$notLoggedin');
      return;
    });

  })

  .service('Stormpath', ["$window", "$rootScope", "$q", "$http", "$state", "$cookieStore", "$interval", "$auth",
    function($window, $rootScope, $q, $http, $state, $cookieStore, $interval, $auth){
      var sessionData = {
        "remain": -1
      };
      var fightTimer = undefined;

      return {
        resetFight: function(seconds){
          sessionData.remain = seconds;
        },

        stopFight: function(){
          if (angular.isDefined(fightTimer)){
            $interval.cancel(fightTimer);
            fightTimer = undefined;
          }
        },

        fight: function(){
          if (angular.isDefined(fightTimer) || sessionData.remain <= 0) return;

          fightTimer = $interval(function () {
            sessionData.remain --;
            //console.log(sessionData.remain);
            if (sessionData.remain <= 5){
              $("#session-modal").modal('hide');

              $auth.endSession().then(function(){
                $state.go('login');
              }).catch(function(){
                $state.go('login');
              });

              return;
            }
            else if (sessionData.remain <= 10){
              if ($("#term-modal").hasClass('in')){
                $("#term-modal").modal('hide');
              }
              if (!$("#session-modal").hasClass('in')){
                $("#session-modal").modal({'backdrop': 'static', 'keyboard': false});
              }
            }
          }, 1000);
        }

      };
  }]);
