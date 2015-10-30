'use strict';
//Base controller, one purpose is going to set access_token to http headers
angular.module('caregiversComApp')
  .controller('ApplicationCtrl', function ($scope, $http, $cookies) {
    //console.log("ApplicationCtrl");
    if ($cookies.get('access_token')) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('access_token');
        $http.defaults.headers.common.withCredentials = true;
    }
    $scope.debugMode = false;
  });
