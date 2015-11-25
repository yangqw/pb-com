'use strict';

angular.module('caregiversComApp')
  .controller('TimeSheetMainCtrl', function($scope, $stateParams) {
    var vm = this;
    vm.a = "a";
  })
  .controller('TimeSheetCtrl', function ($scope) {
    $scope.oldYears = [
      {name: "This Year", path: "2015"},
      {name: "2014", path: "2014"},
      {name: "2013", path: "2013"}
    ]
    $scope.timeSheet =[
        {
          date: "Thu, Oct 1",
          times: [
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
          ]
        },
        {
          date: "Thu, Oct 1",
          times: [
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
          ]
        },
        {
          date: "Thu, Oct 1",
          times: [
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
          ]
        },
        {
          date: "Thu, Oct 1",
          times: [
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
          ]
        },
        {
          date: "Thu, Oct 1",
          times: [
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
          ]
        },
        {
          date: "Thu, Oct 1",
          times: [
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
            {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
          ]
        }
      ]
  })
  .controller('TimeSheetYearCtrl', function ($scope, $stateParams) {
    // shows month in this year
    $scope.months = {
      year: $stateParams.year,
      month: [
        {name:"January", path: "jan" },
        {name:"FEBUARY", path: "feb" },
        {name:"MARCH", path: "march"},
        {name:"APRIL", path: "january"},
        {name:"MAY", path: "january"},
        {name:"JUNE", path: "january"},
        {name:"JULY", path: "january"},
        {name:"AUGEST", path: "january"},
        {name:"SEPTEMBER", path: "january"},
        {name:"OCTOBER", path: "january"},
        {name:"NOVEMBER", path: "january"},
        {name:"DECEMBER", path: "january"},
      ]
    };
  })
  .controller('TimeSheetMonthCtrl', function($scope, $stateParams) {
    // show each weeks in this Month
    $scope.weekTS = {
      year: $stateParams.year,
      month: $stateParams.month,
      weeks: [
        {
          path: '1-7',
          name: "Jan 1 - 7",
          data: [
            {name: "Amy W.",elapse: "38h 20m"},
            {name: "Amy W.",elapse: "35h 47m"}],
          total: "74h 07m"
        },
        {
          path: '8-14',
          name: "Jan 1 - 7",
          data: [
            {name: "Amy W.",elapse: "38h 20m"},
            {name: "Amy W.",elapse: "35h 47m"}],
          total: "74h 07m"
        },
      ]
    }
  })
  .controller('TimeSheetWeekCtrl', function($scope, $stateParams) {
    var vm = this;
    vm.stateInfo = $stateParams
    vm.totalTime = "74h 07m"
    console.log(vm.stateInfo);
    vm.daysGroup = [
      {
        name: "Wed, Jan 1",
        data: [
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
        ]
      },
      {
        name: "Thu, Jan 2",
        data: [
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
        ]
      },
      {
        name: "Fri, Jan 3",
        data: [
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
        ]
      },
      {
        name: "Sat, Jan 4",
        data: [
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
        ]
      },
      {
        name: "Sun, Jan 1",
        data: [
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"},
          {name: "Amy W.", start: "3:25 PM", end: "6:45 PM", elapse: "3h 20m"}
        ]
      },
    ]
    // show each day in this week
  })
