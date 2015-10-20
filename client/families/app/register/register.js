'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'families/app/register/register.html',
        controller: 'RegisterCtrl'
      });
  });
