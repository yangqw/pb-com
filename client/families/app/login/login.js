'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'families/app/login/login.html',
        controller: 'LoginCtrl',
        visible: {
          navbar: false,
          sidebar: false,
          footer: false
        }
      });
  });
