(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('RequestForBackupCtrl', RequestForBackupCtrl);

  RequestForBackupCtrl.$inject = ['$scope', 'filterFilter','Review', 'Backup','$stateParams', '$user', '$http', '$cookies', '$location', '$state'];

  function RequestForBackupCtrl($scope, filterFilter,Review, Backup, $stateParams, $user, $http, $cookies, $location, $state) {
    var vm = this;
    vm.start = null;
    vm.end = null;
    vm.notes = null;

    vm.onSet = function() {
      var startDate = null;
      var endDate = null;
      if (vm.start) {
        startDate = new Date(vm.start).toISOString();
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
      var token = "";
        //$user.get().then(function(user) { No need to get the user info

        var accessToken = $cookies.get('access_token') || $location.search().accessToken;
        if (accessToken) {
          $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
          token = $http.defaults.headers.common.Authorization;
          $http.defaults.headers.common.withCredentials = true;
        }
        else{
          $http.defaults.headers.common.Authorization = 'Bearer ' + user.access_token;
          token = $http.defaults.headers.common.Authorization;
          $http.defaults.headers.common.withCredentials = true;
        }
        console.log('token: ', token);
        var data = {
          absenceStartDate: new Date(vm.start).toISOString(),
          absenceEndDate: new Date(vm.end).toISOString(),
          notes: vm.notes
        };
        Backup.submitBackup(token, data).then(function(response) {
          $state.go('headless.request-for-backup-done');
        });
    //})
      console.log('saved', backupData);
    }
    vm.saveBackup = saveBackup;
  }
})()
