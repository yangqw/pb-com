'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('gdn', {
        url: '/gdn',
        templateUrl: 'families/app/gdn/gdn.html',
        abstract: true,
        controller: "GdnMainCtrl as mainCtrl"
      })
      .state('gdn.list', {
        url: '/list',
        templateUrl: 'families/app/gdn/gdn-index.html',
        controller: 'GdnCtrl as indexCtrl'
      })
      // .state('gdn.id', {
      //   url: '/:id/:name',
      //   templateUrl: 'families/app/file/gdn-detail.html',
      //   controller: 'FileDetailCtrl'
      // })
  });
