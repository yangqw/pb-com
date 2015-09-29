'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user) {
    $scope.message = 'Hello';
    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token)
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = true;
        $cookies.put('access_token', httpResponse.access_token);
    });
  });
