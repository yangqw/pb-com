'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies) {
    $scope.message = 'Hello';
    $scope.$on('$authenticated', function(scope, response) {
      var getAccessToken = function() {
      };
      // 
      $http.defaults.headers.common.Authorization = 'Bearer ' + getAccessToken();
    })
  });
