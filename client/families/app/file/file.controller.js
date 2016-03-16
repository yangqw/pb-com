'use strict';

angular.module('caregiversComApp')
  .controller('FileMainCtrl', function($scope, $stateParams) {
    var vm = this;
    vm.a = "a";
  })

  .controller('FileCtrl', function ($rootScope, $scope, $http, $timeout, FileUploader, focus, $filter, process) {
    $scope.files = new Array();
    $scope.uploadedFiles = new Array();
    $scope.generatedFiles = new Array();

    $scope.dtUploadedFile = null;
    $scope.dtGeneratedFile = null;

    $scope.extentFileModel = function(v){
      v.isUploaded = v.Type && v.Type.match(/^upload$/i);
      v.allowRegister = v.FileName && v.FileName.match(/.tpc|.des|.ill|.psd|.tiff|.tif$/i);
      v.allowConvert = v.isUploaded && v.allowRegister;
      v.register = function(){
        $scope.registerModel.URL = v.SessionID;
        $scope.register(v);
      };

      v.generate = function(){
        $scope.generateModel.URL = v.SessionID;
        $scope.generate();
      };

      v.remove = function(){
        $scope.removeModel.SessionID = v.SessionID;
        $scope.remove();

        // $scope.files = $.grep($scope.files, function(file, i){
        //   return file.SessionID !== v.SessionID;
        // });
        //
        // if (!v.isUploaded)
        //   $scope.generatedFiles = $.grep($scope.generatedFiles, function(file, i){
        //     return file.SessionID !== v.SessionID;
        //   });
        // else
        //   $scope.uploadedFiles = $.grep($scope.uploadedFiles, function(file, i){
        //     return file.SessionID !== v.SessionID;
        //   });

        var srcDataTable = v.isUploaded ? $scope.dtUploadedFile : $scope.dtGeneratedFile;
        var page = srcDataTable.page();
        var pageLength = srcDataTable.page.len();
        srcDataTable.rows(function(idx, data, node){
          return data[0].indexOf(v.SessionID + '</span>') > -1  ? true: false;
        }).remove().draw('page');
      };
    };

    $scope.initDataTable = function(){
      if (!$scope.dtUploadedFile){
        $scope.dtUploadedFile = $("#tblUploadedFile").DataTable({
          "order": [0,"desc"],
          "pageLength": 5,
          "columnDefs": [
            {"orderable": false, "targets": 4}
          ],
          dom: "Bfrtip",
        });
        $scope.isUploadedFileLoaded = true;
      }

      if (!$scope.dtGeneratedFile){
        $scope.dtGeneratedFile = $("#tblGeneratedFile").DataTable({
          "order": [0,"desc"],
          "pageLength": 5,
          "columnDefs": [
            {"orderable": false, "targets": 3}
          ],
          dom: "Bfrtip",
        });
        $scope.isGeneratedFileLoaded = true;
      }

    };

    $scope.ticket = process.requestTicket('file');
    var urlFile = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_file.LIST_ENDPOINT;
    $http.get(urlFile).success(function(response){
      if (!response || response.RETCODE !== "S" || !response.DATA){
        $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
        $scope.initDataTable();
        return;
      }

      $scope.files = !$.isArray(response.DATA) ? new Array(response.DATA) : response.DATA;
      angular.forEach($scope.files, function(v,k){
        $scope.extentFileModel(v);
      });

      $scope.uploadedFiles = $.grep($scope.files, function(file, idx){
        return angular.isDefined(file.Type) && file.Type === 'upload';
      });
      $scope.generatedFiles = $.grep($scope.files, function(file, idx){
        return angular.isDefined(file.Type) && file.Type !== 'upload' && file.Type !== 'json';
      });

      $timeout(function(){
        if (process.isValidTicket($scope.ticket)) {
          $scope.initDataTable();
        }//else process.reduceTicketByName($scope.ticket.name);
      },1000);

    }).error(function(error) {
      $scope.error = error;
      console.log(("Error while post " + urlFile + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
    }).catch(function(){$scope.error = response;});

    $scope.designGdn = "";
    $scope.registerModel = (typeof $scope.registerModel==='object') ? $scope.registerModel : {URL:''};
    $scope.register = function(v){
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
        v.designGdn = response.DATA.DESIGN_SUM_TBL.GDN;
        v.designName = response.DATA.DESIGN_SUM_TBL.DesignName;
        v.isSuccess = true;

        $timeout(function(){
          $scope.created = false;
          $scope.registerModel.URL = "";

          v.designGdn = "";
          v.designName = "";
          v.isSuccess = false;
        }, 10000);

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
      var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_file.GENERATE_DES_ENDPOINT + $scope.generateModel.URL;
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
        $scope.desFile = response.DATA;

        $scope.dtGeneratedFile.clear();
        $scope.dtGeneratedFile.destroy(false);

        var result = [];
        angular.copy($scope.generatedFiles, result);
        result.unshift(response.DATA);

        $scope.generatedFiles = [];
        angular.copy(result,$scope.generatedFiles);
        angular.forEach($scope.generatedFiles, function(v,k){
          $scope.extentFileModel(v);
        });

        $scope.isGeneratedFileLoaded = false;
        $timeout(function(){
          $scope.dtGeneratedFile = null;
          $scope.initDataTable();
        },1000);
      }).error(function(error) {
        $scope.generating = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        $scope.generating = false;
        $scope.error = response;
      });
    };

    $scope.removeFileId = "";
    $scope.removeModel = (typeof $scope.removeModel==='object') ? $scope.removeModel : {SessionID:''};
    $scope.remove = function(){
      $scope.removing = true;
      $scope.error = null;
      $scope.removeFileId = "";
      var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_file.DELETE_ENDPOINT + $scope.removeModel.SessionID;
      $http.get(url).success(function(response){
        if (!response || response.RETCODE !== "S" || !response.DATA){
          $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';

          $timeout(function(){
            $scope.removed = false;
            $scope.removing = false;
            $scope.removeModel.SessionID = "";
          }, 5000);
          return;

          $scope.removed = true;
          $scope.removing = false;
          $scope.removeFileId = response.DATA;

        }
      }).error(function(error) {
        $scope.removing = false;
        $scope.error = error;
        console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
      }).catch(function(response){
        $scope.removing = false;
        $scope.error = response;
      });
    };

  })

  .controller('FileDetailCtrl', function ($rootScope, $scope, $stateParams, $http, $timeout, $filter, x2js) {
    $scope.data = {
      "Name": "",
      "Raw": {},
      "Header":{},
      "CustomHeaders":{}
    };
    if ($stateParams.name) $scope.data.Name = $stateParams.name;

    var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.RAW_STRUCTURE_ENDPOINT + $stateParams.id;
    $http.get(url).success(function(response){
      if (!response || response.RETCODE !== "S" || !response.DATA){
        $scope.error = response.ERRBUF || response.RETMSG || 'XHR Error';
        return;
      }
      var jsonUrl = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_file.ATTACHMENT_ENDPOINT + response.DATA;
      $http.get(jsonUrl).success(function(data){
        if (!data){
          $scope.error = 'XHR Error';
          return;
        }

        var result = data;
        if (result.substring && result.indexOf && result.lastIndexOf){
          result = "{" + result.substring(result.indexOf("DpuUnit") - 1, result.lastIndexOf("}}") + 2);
          result = JSON.parse(result);
        }

        if (result.Header) {
          $scope.data.HeaderRaw = result.Header;
          $scope.data.Header = x2js.xml_str2json(result.Header);

          //$scope.data.HeaderSrc = $scope.data.Header.pdnImage.custom.thumb._png;
          //result.Header.substring(result.Header.indexOf('thumb png="') + 11, result.Header.lastIndexOf('" /></custom></pdnImage>'));
          delete result["Header"];
        }
        if (result.CustomHeaders) {
          $scope.data.CustomHeadersRaw = result.CustomHeaders;
          $scope.data.CustomHeaders = x2js.xml_str2json(result.CustomHeaders);
          //$scope.data.CustomHeadersSrc = result.CustomHeaders.substring(result.CustomHeaders.indexOf('thumb png="') + 11, result.CustomHeaders.lastIndexOf('" />'));
          delete result["CustomHeaders"];
        }
        $scope.data.Raw = result;
      });
    }).error(function(error) {
      $scope.error = error;
      console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
    }).catch(function(response){
      $scope.error = response;
    });


  });
