'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user) {
    //console.log('MainCrtl');

    $scope.currentContact = {"firstName":"", "email":""};
    if ($user && $user.currentUser && $user.currentUser.contactId){

      $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
      .success(function(response) {
        if (response && response.content)
          $scope.currentContact = response.content;
      });
    }
  });
