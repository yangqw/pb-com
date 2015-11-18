'use strict';

angular.module('caregiversComApp')
  .controller('AccountCtrl', function ($scope, $http, $user, $state, $window, $timeout) {

    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

  });
