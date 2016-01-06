(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('RequestForBackupCtrl', RequestForBackupCtrl);

  RequestForBackupCtrl.$inject = ['$scope', 'filterFilter','Review', '$stateParams', '$user'];

  function RequestForBackupCtrl($scope, filterFilter,Review, $stateParams, $user) {
    var vm = this;
    vm.start = null;
    vm.end = null;
    vm.notes = null;

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
    var saveBackup = function() {

      var backupData = this;
      //console.log($stateParams.id);
        console.log($stateParams.id);
        //this.id = $stateParams.id;
   //  $user.get().then(function(user) {
      Review.submitBackup({id: $stateParams.id}, backupData, function(response) {
          console.log(response);
      })
   // })
      console.log('saved', backupData);
    }
    vm.saveBackup = saveBackup;
  }
})()
