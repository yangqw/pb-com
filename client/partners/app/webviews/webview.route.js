'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('headless.adjust-availiabilty', {
        url: '/availiabilty/edit',
        templateUrl: 'partners/app/webviews/adjust-availiabilty.html',
        controller: 'AdjustAvailibiltyCtrl as avaCtrl'
      })
      .state('headless.adjust-availiabilty-done', {
        url: '/availiabilty/done',
        templateUrl: 'partners/app/webviews/adjust-availiabilty-done.html',
      })
      .state('headless.request-for-backup', {
        url: '/request-for-backup/:id',
        templateUrl: 'partners/app/webviews/request-for-backup.html',
        controller: 'RequestForBackupCtrl as rCtrl'
      })
      .state('headless.full-review.detail', {
        url: '/:id',
        templateUrl: 'partners/app/webviews/full_review_detail.html',
        controller: 'FullReviewDetailCtrl as frdCtrl'
      })
      .state('headless.full-review', {
        url: '/full-review',
        templateUrl: 'partners/app/webviews/full_review.html',
        controller: 'FullReviewCtrl as frCtrl'
      })
  });
