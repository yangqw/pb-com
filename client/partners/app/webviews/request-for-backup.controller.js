(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('RequestForBackupCtrl', RequestForBackupCtrl);

  RequestForBackupCtrl.$inject = ['$scope', 'filterFilter'];

  function RequestForBackupCtrl($scope, filterFilter) {
    var vm = this;
    vm.start = null;
    vm.end = null;

    vm.onSet = function() {
      var startDate = null;
      var endDate = null;
      if (vm.start) {
        startDate = new Date(vm.start)
        vm.minDate = startDate.toISOString();
        if (vm.end) {
          endDate = new Date(vm.end)
          if (endDate < startDate) {
            vm.end = null;
          }
        }
      }
    }
  }
})()
