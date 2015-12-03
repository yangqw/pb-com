'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('time-sheet', {
        url: '/time-sheet',
        templateUrl: 'families/app/time-sheet/time-sheet.html',
        abstract: true,
        controller: "TimeSheetMainCtrl as mainCtrl"
      })
      .state('time-sheet.list', {
        url: '/list',
        templateUrl: 'families/app/time-sheet/time-sheet-index.html',
        controller: 'TimeSheetCtrl as indexCtrl'
      })
      .state('time-sheet.week', {
        url: '/:year/:month/:week',
        templateUrl: 'families/app/time-sheet/time-sheet-week.html',
        controller: 'TimeSheetWeekCtrl as weekCtrl'
      })
      .state('time-sheet.month', {
        url: '/:year/:month',
        templateUrl: 'families/app/time-sheet/time-sheet-month.html',
        controller: 'TimeSheetMonthCtrl'
      })
      .state('time-sheet.year', {
        url: '/:year',
        templateUrl: 'families/app/time-sheet/time-sheet-year.html',
        controller: 'TimeSheetYearCtrl'
      })
  });
