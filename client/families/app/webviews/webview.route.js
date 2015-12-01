'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('adjust-availiabilty', {
        url: '/availiabilty/edit',
        templateUrl: 'families/app/webviews/adjust-availiabilty.html',
        controller: 'AdjustAvailibiltyCtrl as avaCtrl'
        // views: {
        //   "base@main" : { templateUrl: "families/app/webviews/adjust-availiabilty.html" }
        // }
      })
  });
