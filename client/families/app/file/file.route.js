'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('file', {
        url: '/file',
        templateUrl: 'families/app/file/file.html',
        abstract: true,
        controller: "FileMainCtrl as mainCtrl"
      })
      .state('file.list', {
        url: '/list',
        templateUrl: 'families/app/file/file-index.html',
        controller: 'FileCtrl as indexCtrl'
      })
      .state('file.id', {
        url: '/:id/:name',
        templateUrl: 'families/app/file/file-detail.html',
        controller: 'FileDetailCtrl'
      })
  });
