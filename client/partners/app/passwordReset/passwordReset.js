'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('passwordReset', {
        url: '/password/reset?sptoken',
        templateUrl: 'partners/app/passwordReset/passwordReset.html',
        controller: 'PasswordResetCtrl'
      });
  });
