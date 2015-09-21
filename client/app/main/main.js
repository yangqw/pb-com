'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        sp:{
          waitForUser: true
        }
      });
  });
