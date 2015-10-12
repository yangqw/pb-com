'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user) {
    //console.log('MainCrtl');
    $scope.awesomeThings = [];
    $scope.currentContact = {};
    if ($user && $user.currentUser && $user.currentUser.contactId){
      $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
      .success(function(awesomeThings) {
        if (awesomeThings && awesomeThings.content)
          $scope.currentContact = awesomeThings.content;
        // $scope.awesomeThings = awesomeThings;
        //
        // if (awesomeThings.content){
        //   $.each(awesomeThings.content, function(key, value){
        //     if (value.id == $user.currentUser.contactId){
        //       $scope.currentContact = value;
        //       return false;
        //     }
        //     return true;
        //   });
        // }

      });
    }
  });
