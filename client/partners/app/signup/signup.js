'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'partners/app/signup/signup.html',
        controller: 'SignupCtrl'
      });
  });
