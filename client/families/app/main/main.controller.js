'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user) {
    //console.log('MainCrtl');
    $scope.awesomeThings = [];
    $scope.currentContact = {"firstName":"", "email":""};
    if ($user && $user.currentUser && $user.currentUser.contactId){

      $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
      .success(function(awesomeThings) {
        if (awesomeThings && awesomeThings.content)
          $scope.currentContact = awesomeThings.content;
      });
    }
  });
