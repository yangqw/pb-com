'use strict';

angular.module('caregiversComApp')
  .controller('DesignMainCtrl', function($scope, $stateParams) {
    var vm = this;
    vm.a = "a";
  })
  .controller('DesignCtrl', function ($rootScope, $scope, $http, $timeout, FileUploader) {
    var uploader = new FileUploader({url: CareGiverEnv.server.host_pb + '/default/upload'});

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        //console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        //console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        //console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        //console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        //console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        debugger;
        if (!response || response.RETCODE !== "S"|| !response.DATA){
          fileItem.isError = true;
          fileItem.error = response.ERRBUF || response.RETMSG || 'XHR Error';
          return;
        }

        fileItem.isError = false;
        fileItem.error = null;

        $scope.registerModel.URL = CareGiverEnv.server.host_root + "/" + response.DATA;
        $scope.generateModel.URL = CareGiverEnv.server.host_root + "/" + response.DATA;

    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      debugger;
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    $scope.uploader = uploader;
    console.info('uploader', $scope.uploader);

    $scope.designs = [];
    var url = CareGiverEnv.server.host_pb + '/default/List';
    $http.get(url).success(function(response){
      if (!response || response.RETCODE !== "S" || !response.DATA){
        $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
        return;
      }
      $scope.designs = !$.isArray(response.DATA) ? new Array(response.DATA) : response.DATA;
    }).error(function(error) {
      $scope.error = error;
      console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
    }).catch(function(response){
      $scope.error = response;
    });

    $scope.designGdn = "";
    $scope.registerModel = (typeof $scope.registerModel==='object') ? $scope.registerModel : {URL:''};
    $scope.register = function(){
      $scope.creating = true;
      $scope.error = null;
      $scope.designGdn = "";
      var url = CareGiverEnv.server.host_pb + '/default/ANNEXJ.REGISTER_DESIGN';
      // if ($scope.registerModel.URL.indexOf(CareGiverEnv.server.host_root) < 0){
      //   $scope.registerModel.URL = CareGiverEnv.server.host_root + "\\" + $scope.registerModel.URL
      // }
      $http.post(url, $scope.registerModel).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';

          $timeout(function(){
            $scope.created = false;
            $scope.creating = false;
            $scope.registerModel.URL = "";
          }, 3000);
          return;
        }
        $scope.created = true;
        $scope.creating = false;
        $scope.designs.unshift(response.DATA);
        $scope.designGdn = response.DATA.DESIGN_SUM_TBL.GDN;
        $rootScope.currentDesign = response.DATA;

        $timeout(function(){
          $scope.created = false;
          $scope.registerModel.URL = "";
        }, 3000);
      }).error(function(error) {
        $scope.creating = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        $scope.creating = false;
        $scope.error = response;
      });
    };

    $scope.desFile = "";
    $scope.generateModel = (typeof $scope.generateModel==='object') ? $scope.generateModel : {URL:''};
    $scope.generate = function(){
      $scope.generating = true;
      $scope.error = null;
      $scope.desFile = "";
      var url = CareGiverEnv.server.host_pb + '/default/ANNEXJ.GENERATE_DES?URL=' + $scope.generateModel.URL;
      $http.get(url).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';

          $timeout(function(){
            $scope.generated = false;
            $scope.generating = false;
            $scope.generateModel.URL = "";
          }, 3000);
          return;
        }

        $scope.generated = true;
        $scope.generating = false;
        $scope.desFile = response.DATA;
      }).error(function(error) {
        debugger;
        $scope.generating = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        debugger;
        $scope.generating = false;
        $scope.error = response;
      });
    };
    $scope.back2Generate = function(){
      $scope.generateModel.URL = "";
      $scope.generated = false;
      $scope.desFile = "";
    };
  })
  .controller('DesignDetailCtrl', function ($rootScope, $scope, $stateParams, $http) {
    $scope.design = $rootScope.currentDesign;
    var url = CareGiverEnv.server.host_pb + '/default/GDN?GDN=' + $stateParams.gdn;
    $http.get(url).success(function(response){
      if (!response || response.RETCODE !== "S" || !response.DATA){
        $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
        return;
      }

      $scope.design = $.isArray(response.DATA) ? response.DATA[0] : response.DATA;
    }).error(function(error) {
      $scope.error = error;
      console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
    }).catch(function(response){
      $scope.error = response;
    });

    $scope.months = {
      gdn: $stateParams.gdn,
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
  });
