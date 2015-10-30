'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'partners/app/main/main.html',
        controller: 'MainCtrl'
      });
  });
