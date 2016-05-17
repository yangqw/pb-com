'use strict';

angular.module('caregiversComApp')
  .controller('DesignMainCtrl', function($scope, $stateParams) {
    var vm = this;
    vm.a = "a";
  })

  .controller('DesignCtrl', function ($rootScope, $scope, $http, $timeout, FileUploader, focus, $filter, process) {

    var uploader = new FileUploader({url: CareGiverEnv.server.host_pb + CareGiverEnv.server.api_file.UPLOAD_ENDPOINT});

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
        //console.info('onSuccessItem', fileItem, response, status, headers);
        if (!response || response.RETCODE !== "S"|| !response.DATA){
          fileItem.isError = true;
          fileItem.error = response.ERRBUF || response.RETMSG || 'XHR Error';
          return;
        }

        var fileName = fileItem.file.name.toLowerCase();
        fileItem.isTpc = fileName.match(/.tpc|.des|.pat|.ill|.psd|.tiff|.tif$/i);
        fileItem.isError = false;
        fileItem.error = null;

        var isSessionId = !(response.DATA.indexOf('/') > -1 || response.DATA.indexOf('\\') > -1);
        fileItem.path = isSessionId ? response.DATA : (CareGiverEnv.server.host_asset_path + "/" + response.DATA);
        fileItem.link = isSessionId
          ? (CareGiverEnv.server.host_pb + CareGiverEnv.server.api_file.ATTACHMENT_ENDPOINT + response.DATA)
          : (CareGiverEnv.server.host_asset_url + "/" + response.DATA);

        if (fileItem.isTpc){
          $scope.registerModel.URL = fileItem.path;
          if (fileName.match(/.tpc$/)) $scope.generateModel.URL = fileItem.path;
        }
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
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

    $scope.designs = new Array();
    $scope.dataTable = null;

    $scope.ticket = process.requestTicket('design');
    var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.LIST_ENDPOINT;
    $http.get(url).success(function(response){
      if (!response || response.RETCODE !== "S" || !response.DATA){
        $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
        $scope.dataTable = $("#tblDesigns").DataTable();
        $scope.isDsnLoaded = true;
        return;
      }
      $scope.designs = !$.isArray(response.DATA) ? new Array(response.DATA) : response.DATA;

      if ($scope.dataTable == null)
      $timeout(function(){
        if (process.isValidTicket($scope.ticket)){
          $scope.dataTable = $("#tblDesigns").DataTable({"order": [0,"desc"], dom: "Bfrtip"});
          $scope.isDsnLoaded = true;
        }
      },1000);
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

      var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.REGISTER_ENDPOINT;
      $http.post(url, $scope.registerModel).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';

          $timeout(function(){
            $scope.created = false;
            $scope.creating = false;
            $scope.registerModel.URL = "";
          }, 10000);
          return;
        }
        $scope.created = true;
        $scope.creating = false;

        if (angular.isArray(response.DATA) && response.DATA.length > 0) response.DATA = response.DATA[0];
        $scope.designGdn = response.DATA.DESIGN_SUM_TBL.ID;
        $rootScope.currentDesign = response.DATA;

        $timeout(function(){debugger;
            $scope.dataTable.row.add( [
              '<div class="ng-binding ng-hide" ng-hide="true">'+ response.DATA.DESIGN_SUM_TBL.CREATED_AT + '</div>' + $filter('date')(response.DATA.DESIGN_SUM_TBL.CREATED_AT * 1000, 'dd/MMM/yyyy hh:mm a'),
              response.DATA.DESIGN_SUM_TBL.ID,
              '<a href="/design/' + response.DATA.DESIGN_SUM_TBL.ID + '" class="ng-binding" ui-sref="design.gdn({gdn: data.DESIGN_SUM_TBL.ID})">' + response.DATA.DESIGN_SUM_TBL.ITEM_NAME + '</a>',
              '<img style="width: 25px!important; height: 25px!important;" src="' + $filter('resUrlParser')(response.DATA.DESIGN_SUM_TBL.THUMBNAIL_75) + '">']
            ).order( [ 0, 'desc' ] ).draw();
        },1000);

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
    $scope.generate = function(type){
      $scope.generating = true;
      $scope.error = null;
      $scope.desFile = "";
      var url = CareGiverEnv.server.host_pb
        + (type === 'PAT' ? CareGiverEnv.server.api_file.GENERATE_PAT_ENDPOINT : CareGiverEnv.server.api_file.GENERATE_DES_ENDPOINT)
        + $scope.generateModel.URL;
      $http.get(url).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';

          $timeout(function(){
            $scope.generated = false;
            $scope.generating = false;
            $scope.generateModel.URL = "";
          }, 5000);
          return;
        }

        $scope.generated = true;
        $scope.generating = false;
        if (type === 'PAT') $scope.patFile = response.DATA.RelativePath;
        else $scope.desFile = response.DATA.RelativePath;

      }).error(function(error) {
        $scope.generating = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        $scope.generating = false;
        $scope.error = response;
      });
    };
    $scope.back2Generate = function(){
      $scope.generateModel.URL = "";
      $scope.generated = false;
      $scope.desFile = "";
      $scope.patFile = "";
    };
    $scope.setRegisterInput = function(input){
      $scope.registerModel.URL = input;
      focus('btnRegister');
    }
    $scope.setGenerateInput = function(input){
      $scope.generateModel.URL = input;
      focus('btnGenerate');
    }
  })

  .controller('DesignDetailCtrl', function ($rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.design = $rootScope.currentDesign;
    var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.ID_ENDPOINT + $stateParams.gdn;
    $http.get(url).success(function(response){
      if (!response || response.RETCODE !== "S" || !response.DATA){
        $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
        return;
      }

      $scope.design = $.isArray(response.DATA) ? response.DATA[0] : response.DATA;
      $timeout(function(){
          $("#tblPosition").DataTable({
            "order": [0,"asc"],
            dom: "Bfrtip",
            select: true,
            scrollY: 260,
            scrollX: true,
            scrollCollapse: true,
            scroller: true
          });

          $("#tblTreatment").DataTable({
            "order": [0,"asc"],
            dom: "Bfrtip",
            select: true,
            scrollY: 260,
            scrollX: true,
            scrollCollapse: true,
            scroller: true
          });

          $("#tblInstruction").DataTable({
            "order": [0,"asc"],
            dom: "Bfrtip",
            select: true
          });

          $scope.isPosLoaded = true;

      },1000);
      //$scope.$apply();
    }).error(function(error) {
      $scope.error = error;
      console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
    }).catch(function(response){
      $scope.error = response;
    });

    $scope.saveSummary = function(){
      if (!$scope.design || !$scope.design.DESIGN_SUM_TBL) return;

      $scope.saving = true;
      $scope.error = null;
      var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.UPDATE_ENDPOINT;
      $http.post(url, $scope.design).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
          $scope.saved = false;
          $scope.saving = false;
          return;
        }
        $scope.saved = true;
        $scope.saving = false;

        $timeout(function(){
          $scope.saved = false;
          $scope.saving = false;
        }, 3000);

      }).error(function(error) {
        $scope.saving = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        debugger;
        $scope.saving = false;
        $scope.error = response;
      });
    };
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
