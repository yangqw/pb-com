'use strict';

angular.module('caregiversComApp')

.controller('CgLoginFormCtrl', ['$scope','$auth','$rootScope',function ($scope,$auth,$rootScope) {

  $scope.formModel = {
    username: '',
    password: '',
    domain: CareGiverEnv.spGroupName,
    isStaging: CareGiverEnv.isStaging === true
  };
  if (!$rootScope.isAutoLogin) $rootScope.posting = false;
  $scope.submit = function(){
    $scope.errorMsg = '';
    $rootScope.posting = true;
    $rootScope.error = null;
    $rootScope.processMsg = 'Authenticating...';
    $auth.authenticate($scope.formModel)
      .catch(function(response){
        $rootScope.posting = false;
        $rootScope.error = response.data && response.data.error || 'XHR Error';
      });
  };
}])

.directive('cgLoginForm',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spLoginForm.tpl.html';
    },
    controller: 'CgLoginFormCtrl'
  };
});
