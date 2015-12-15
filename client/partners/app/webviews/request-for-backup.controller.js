(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('RequestForBackupCtrl', RequestForBackupCtrl);

  RequestForBackupCtrl.$inject = ['$scope', 'filterFilter'];

  function RequestForBackupCtrl($scope, filterFilter) {
    var vm = this;
    vm.init = function() {
      $('.datepicker').pickadate();
    }

    vm.init()
  }
})()
