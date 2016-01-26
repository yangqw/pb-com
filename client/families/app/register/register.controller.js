'use strict';

angular.module('caregiversComApp')
  .filter('resUrlParser', function(){
    return function(input){
      input = input || '';
      var out = input;

      var imgServerUrl = CareGiverEnv.server.host_img + '/';
      var idxOfImgServerUrl = input.indexOf(imgServerUrl);
      if (idxOfImgServerUrl >= 0){
        // var idxOfRemain = input.indexOf(":", idxOfSpStatement + spStatement.length)
        // out = input.substring(idxOfRemain + 1);
      }
      else out = imgServerUrl + out;//.replaceAll('\\', '/');
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
