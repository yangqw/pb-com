(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('AdjustAvailibiltyCtrl', AdjustAvailibiltyCtrl);

  AdjustAvailibiltyCtrl.$inject = ['$scope', 'filterFilter'];

  function AdjustAvailibiltyCtrl($scope, filterFilter) {
    var vm = this;

    vm.hoursPerWeek = [
      {desc: '20 or fewer hours', id: 0},
      {desc: '21 - 34 hours', id: 1},
      {desc: '35+ hours', id: 2},
    ]

    vm.hoursPerWeekDesc = vm.hoursPerWeek[0].desc

    vm.availibiltyInfo = {
      days: {
        'sun': {status: false, display: "s"},
        'mon': {status: false, display: "m"},
        'tue': {status: false, display: "t"},
        'wed': {status: true, display: "w"},
        'thu': {status: false, display: "t"},
        'fri': {status: false, display: "f"},
        'sat': {status: false, display: "s"}
      },
      hoursPerWeek: 0
    }

    $scope.$watch('', function() {
      $('.hours').dropdown();
    })


    var setHoursPerWeekDesc = function(option) {
      for (var i in vm.hoursPerWeek) {
        if (vm.hoursPerWeek[i].id === option.id) {
          vm.hoursPerWeekDesc = option.desc
        }
      }
    }

    var toggleDay = function(day) {
      vm.availibiltyInfo.days[day].status = !vm.availibiltyInfo.days[day].status
    }

    vm.toggleDay = toggleDay;

    vm.selectHoursPerWeek = function(option) {
      vm.availibiltyInfo.hoursPerWeek = option.id
      setHoursPerWeekDesc(option)
    }
  }

})()
