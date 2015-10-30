'use strict';
//Base controller, one purpose is going to set access_token to http headers
angular.module('caregiversComApp')
  .controller('ApplicationCtrl', function ($scope, $http, $cookies, $user, $rootScope, $state) {
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

    $rootScope.location = null;
    $.get("http://ipinfo.io/json", function(response){
      $rootScope.location = response;
    });

  });
