'use strict';

angular.module('caregiversComApp')
  .filter('fileNameParser', function(){
    return function(input){
      if (!input) return '';

      input = input || '';
      var out = input;//.replace(new RegExp(' ', 'g'), '');

      var idxOfSeperator= input.lastIndexOf('\\');
      if (idxOfSeperator < 0) idxOfSeperator = input.lastIndexOf('/');
      if (idxOfSeperator >= 0){
        out = out.substring(idxOfSeperator+1);
      }

      return out;
    };
  })
  .filter('relativePathParser', function(){
    return function(input){
      if (!input) return '';

      input = input || '';
      var out = input;//.replace(new RegExp(' ', 'g'), '');

      var assetServerPath = CareGiverEnv.server.host_asset_path;
      var assetServerPath1 = CareGiverEnv.server.host_asset_path.replace(new RegExp('/', 'g'), '\\');
      var idxOfAssetServerPath= input.indexOf(assetServerPath);
      if (idxOfAssetServerPath < 0) idxOfAssetServerPath = input.indexOf(assetServerPath1);
      if (idxOfAssetServerPath >= 0){
        out = out.replace(assetServerPath, "");
        out = out.replace(assetServerPath1, "");
      }

      return out;
    };
  })
  .filter('resUrlParser', function(){
    return function(input){
      if (!input) return '';

      input = input || '';
      var out = input;//.replace(new RegExp(' ', 'g'), '');

      var imgServerUrl = CareGiverEnv.server.host_asset_url + '/';
      var idxOfImgServerUrl = input.indexOf(imgServerUrl);
      if (idxOfImgServerUrl >= 0){}
      else out = imgServerUrl + out;
      return out;
    };
  })
  .filter('uselessSpInfo', function(){
    return function(input){
      input = input || '';
      var out = input;

      var spStatement = 'http://docs.stormpath.com/errors'
      var idxOfSpStatement = input.indexOf(spStatement);
      if (idxOfSpStatement >= 0){
        var idxOfRemain = input.indexOf(":", idxOfSpStatement + spStatement.length)
        out = input.substring(idxOfRemain + 1);
      }

      out = out.replace(/account surname/i, 'Last Name')
      .replace(/account givenName/i, 'First Name')
      .replace(/account email address/i, 'Email')
      .replace(/null, empty, or blank/i, 'empty');
      return out;
    };
  })
  .controller('RegisterCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
