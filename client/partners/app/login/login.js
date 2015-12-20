'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'partners/app/login/login.html',
        controller: 'LoginCtrl',
        sp: {
          authenticate: false
        }
      });
  });
