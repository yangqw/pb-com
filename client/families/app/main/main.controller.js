'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user) {
    //console.log('MainCrtl');

    if ($user && $user.currentUser && $user.currentUser.contactId
    && !$user.currentUser.contact){
      $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
      .success(function(response) {
        if (response && response.content)
          $user.currentUser.contact = response.content;
      });
    }
  });
