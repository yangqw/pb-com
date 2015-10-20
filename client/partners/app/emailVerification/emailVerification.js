'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('emailVerification', {
        url: '/register/verify?sptoken',
        templateUrl: 'partners/app/emailVerification/emailVerification.html',
        controller: 'EmailVerificationCtrl'
      });
  });
