'use strict';

angular.module('caregiversComApp')
  .controller('GdnMainCtrl', function($scope, $stateParams) {
    var vm = this;
    vm.a = "a";
  })

  .controller('GdnCtrl', function($rootScope, $scope, $http, $timeout, FileUploader, focus, $filter, process){

    $scope.createModel = (typeof $scope.createModel==='object') ? $scope.createModel
    : {
        username:'shashinbhavsar',password:'1234tpit',
        itemType:'D', brandCode:'N',productCode:'C',
        lineOfBusinessCode:'B',indemnityCode:'r',
        itemName:'', description:''
      };

    $scope.create = function(){
      $scope.creating = true;
      $scope.error = null;
      $scope.createdItem = {};

      var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.CREATE_GDN_ENDPOINT;
      $http.post(url, $scope.createModel).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';

          $timeout(function(){
            $scope.created = false;
            $scope.creating = false;
            $scope.createdItem = {};
          }, 10000);
          return;
        }
        $scope.created = true;
        $scope.creating = false;

        if (angular.isArray(response.DATA) && response.DATA.length > 0) response.DATA = response.DATA[0];
        $scope.createdItem = response.DATA;
        $scope.createdItem._sql = null;

      }).error(function(error) {
        $scope.creating = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        $scope.creating = false;
        $scope.error = response;
      });
    };

    $scope.back2Create = function(){
      $scope.created = false;
      $scope.createdItem = {};
    };
  })
