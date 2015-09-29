'use strict';

angular.module('caregiversComApp')
  .controller('ApplicationCtl', function ($scope, $http, $cookies) {
    console.log("ApplicationCtl");
    if ($cookies.get('access_token')) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('access_token');
        $http.defaults.headers.common.withCredentials = true;
    }
  });
