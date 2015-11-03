'use strict';
//Base controller, one purpose is going to set access_token to http headers
angular.module('caregiversComApp')
  .controller('ApplicationCtrl', function ($scope, $http, $cookies, $user, $rootScope, $state, Stormpath) {
    //console.log("ApplicationCtrl");
    $rootScope.$on('$stateChangeUnauthenticated', function(e, toState, toParams){
      $rootScope.toStateName = toState.name;
    });
    $rootScope.$on('$sessionEnd', function(event, response) {
      $http.defaults.headers.common.Authorization = null;
      $cookies.remove('access_token');
      $user.currentUser = false;

      console.log("$sessionEnd");
    });

    var accessToken = $cookies.get('access_token');
    if (accessToken) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
        $http.defaults.headers.common.withCredentials = true;
    }
    $scope.debugMode = false;
  })

  .service('Stormpath', ["$window", "$rootScope", "$q", "$http", "$state", "$cookieStore", "$interval", "$auth",
    function($window, $rootScope, $q, $http, $state, $cookieStore, $interval, $auth){
      var sessionData = {
        "remain": -1
      };

      var sessionTimer;

      this.resetSession = function(seconds){
        sessionData.remain = seconds;
      };
      this.checkSessionWatcher = function(){
        if (sessionData.remain <= 0) return;

        sessionTimer = $interval(function () {
          sessionData.remain --;
          console.log(sessionData.remain);
          if (sessionData.remain <= 0){
            $("#session-modal").modal('hide');
            $interval.cancel(sessionTimer);

            $auth.endSession().then(function(){
              $state.go('login');
            }).catch(function(){
              $state.go('login');
            });

            return;
          }
          else if (sessionData.remain <= 20){
            $("#session-modal").modal({'backdrop': 'static', 'keyboard': false});
          }
        }, 1000);
      };
  }]);
