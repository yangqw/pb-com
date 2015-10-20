'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'families/app/main/main.html',
        controller: 'MainCtrl',
        sp:{
          waitForUser: true
        }
      });
  });
