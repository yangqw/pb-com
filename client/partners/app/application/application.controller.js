'use strict';
//Base controller, one purpose is going to set access_token to http headers
angular.module('caregiversComApp')
  .controller('ApplicationCtrl', function ($scope, $http, $cookies, $user, $rootScope, $state, Stormpath, $auth) {
    $rootScope.Authorized = false;
    $rootScope.$on('$notLoggedin', function(e){
      $rootScope.Authorized = false;
      if (!angular.equals($state.current.name, "login")
      && !angular.equals($state.current.name, "logout")
      && !angular.equals($state.current.name, "signup")
      && !angular.equals($state.current.name, "main")){
          $state.go('login');
        }
    });
    $rootScope.$on('$currentUser', function(e, user){
      $rootScope.Authorized = true;

      var isSameGroup = angular.isDefined(user.groups)
      && angular.isArray(user.groups) && user.groups.length == 1
      && user.groups[0].name === "CG_" + CareGiverEnv.spGroupName;
      if (!isSameGroup && !angular.equals($state.current.name, "login")){
        $auth.endSession();
        return;
      }

      if (angular.equals(CareGiverEnv.spGroupName, 'PARTNERS')){
        if ($user.currentUser.stripeAccountId
        && $user.currentUser.stripeToken
        && $user.currentUser.stripeToS === undefined){
          if (angular.equals($state.current.name, "login")){$state.go('main');}
          else {$("#term-modal").modal({'backdrop': 'static', 'keyboard': false});}
        }
      }

      var expired = $user.currentUser.expires_in - (new Date().getTime() / 1000);
      Stormpath.resetFight(expired);
      Stormpath.fight();
    });
    $rootScope.$on('$stateChangeUnauthenticated', function(e, toState, toParams){
      $rootScope.$broadcast('$sessionEnd');
      $rootScope.$broadcast('$notLoggedin');
    });
    $rootScope.$on('$sessionEnd', function(event, response) {
      $http.defaults.headers.common.Authorization = null;
      $cookies.remove('access_token');
      $user.currentUser = false;

      $user.currentUser = false;
      $rootScope.Authorized = false;
      Stormpath.stopFight();
    });

    var accessToken = $cookies.get('access_token');
    if (accessToken) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
        $http.defaults.headers.common.withCredentials = true;
    }
    $scope.debugMode = false;

    $rootScope.location = null;
    $.get("http://ipinfo.io/json", function(response){
      $rootScope.location = response;
    });

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
