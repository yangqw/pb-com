'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('passwordResetRequest', {
        url: '/password/requestReset',
        templateUrl: 'families/app/passwordResetRequest/passwordResetRequest.html',
        controller: 'PasswordResetRequestCtrl'
      });
  });
