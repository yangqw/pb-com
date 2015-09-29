'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.awesomeThings = [];
    console.log('MainCrtl');
    $http.get(CareGiverEnv.server.host + '/api/contacts', {withCredentials: true}
    ).success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });
