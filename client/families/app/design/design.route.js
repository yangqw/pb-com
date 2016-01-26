'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('design', {
        url: '/design',
        templateUrl: 'families/app/design/design.html',
        abstract: true,
        controller: "DesignMainCtrl as mainCtrl"
      })
      .state('design.list', {
        url: '/list',
        templateUrl: 'families/app/design/design-index.html',
        controller: 'DesignCtrl as indexCtrl'
      })
      .state('design.gdn', {
        url: '/:gdn',
        templateUrl: 'families/app/design/design-detail.html',
        controller: 'DesignDetailCtrl'
      })
  });
