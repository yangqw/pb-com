'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $scope.awesomeThings = [];
    console.log('MainCrtl');
    $http.get('/contacts'
    // ,{
    //   headers: {"Authorization" : "Bearer xxxxxx"},
    //   withCredentials : true
    // }
    ).success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
    
    $scope.isVisible = false;
    $rootScope.$on('$currentUser', function(event, httpResponse) {
      console.log("currentUser");
      if (httpResponse && httpResponse.access_token)
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
    });
    $rootScope.$on('$notLoggedIn', function(event, httpResponse) {
      console.log("notLoggedIn");
    });
  });
