(function() {
  'use strict';
  angular.module('caregiversComApp')
  .controller('AdjustAvailibiltyCtrl', AdjustAvailibiltyCtrl);

  AdjustAvailibiltyCtrl.$inject = ['$scope'];
  function AdjustAvailibiltyCtrl($scope) {
    var vm = this;

    vm.availibiltyInfo = {
      days: {
        'mon': false,
        'tue': false,
        'wed': true,
        'thu': false,
        'fri': true,
        'sat': false
      },

      hours: {
      }
    }

  }
})()
