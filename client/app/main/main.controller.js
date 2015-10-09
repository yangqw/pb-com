'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user) {
    //console.log('MainCrtl');
    $scope.awesomeThings = [];
    if ($user && $user.currentUser){
      $http.get(CareGiverEnv.server.host + '/v1/contacts', {withCredentials: true}
      ).success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;

        $.each(awesomeThings.content, function(key, value){
          if (value.id == $user.currentUser.contactId){
            $scope.currentContact = value;
            return false;
          }
          return true;
        });
      });
    }
  });
