(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('RequestForBackupCtrl', RequestForBackupCtrl);

  RequestForBackupCtrl.$inject = ['$scope', 'filterFilter','Review', 'Backup','$stateParams', '$user', '$http', '$cookies', '$location'];

  function RequestForBackupCtrl($scope, filterFilter,Review, Backup, $stateParams, $user, $http, $cookies, $location) {
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
      var token = "";
        $user.get().then(function(user) {

        var accessToken = $cookies.get('access_token') || $location.search().accessToken;
        if (accessToken) {
          accessToken = accessToken.replace(/%2E/g, ".")
          $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
          token = $http.defaults.headers.common.Authorization;
          $http.defaults.headers.common.withCredentials = true;
        }
        else{          
          $http.defaults.headers.common.Authorization = 'Bearer ' + user.access_token;
          token = $http.defaults.headers.common.Authorization;
          console.log(token)
          $http.defaults.headers.common.withCredentials = true;
        }
        Backup.submit(backupData, {token: token}, function(response) {
        console.log('response', response);
      })
    })
      console.log('saved', backupData);
    }
    vm.saveBackup = saveBackup;
  }
})()
