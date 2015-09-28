'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies) {
    $scope.message = 'Hello';
    $scope.$on('$authenticated', function(event, httpResponse) {
      //console.log(httpResponse);
      if (httpResponse && httpResponse.access_token)
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
    });
  });
