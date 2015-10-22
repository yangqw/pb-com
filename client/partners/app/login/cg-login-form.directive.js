'use strict';

angular.module('caregiversComApp')

.controller('CgLoginFormCtrl', ['$scope','$auth',function ($scope,$auth) {

  $scope.formModel = {
    username: '',
    password: '',
    domain: CareGiverEnv.spGroupName
  };
  $scope.posting = false;
  $scope.submit = function(){
    $scope.posting = true;
    $scope.error = null;
    $auth.authenticate($scope.formModel)
      .catch(function(response){
        $scope.posting = false;
        $scope.error = response.data && response.data.error || 'XHR Error';
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
