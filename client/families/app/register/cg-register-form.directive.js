'use strict';

angular.module('caregiversComApp')

.controller('CgRegistrationFormCtrl', ['$scope','$user','$auth','$location',function ($scope,$user,$auth,$location) {
  $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
    givenName:'',
    surname: '',
    email: '',
    password: '',
    domain: CareGiverEnv.spGroupName
  };
  $scope.created = false;
  $scope.enabled = false;
  $scope.creating = false;
  $scope.authenticating = false;
  $scope.submit = function(){
    $scope.creating = true;
    $scope.error = null;
    $user.create($scope.formModel)
      .then(function(account){
        $scope.created = true;
        $scope.enabled = account.status === 'ENABLED';
        if($scope.enabled && $scope.autoLogin){
          $scope.authenticating = true;
          $auth.authenticate({
            username: $scope.formModel.email,
            password: $scope.formModel.password
          })
          .then(function(){
            if($scope.postLoginPath){
              $location.path($scope.postLoginPath);
            }
          })
          .catch(function(response){
            $scope.error = response.data.error;
          })
          .finally(function(){
            $scope.authenticating = false;
            $scope.creating = false;
          });
        }else{
          $scope.creating = false;
        }
      })
      .catch(function(response){
        $scope.creating = false;
        $scope.error = response.data.error;
      });
  };
}])

.directive('cgRegistrationForm',function(){
  return {
    templateUrl: function(tElemenet,tAttrs){
      return tAttrs.templateUrl || 'spRegistrationForm.tpl.html';
    },
    controller: 'CgRegistrationFormCtrl',
    link: function(scope,element,attrs){
      scope.autoLogin = attrs.autoLogin==='true';
      scope.postLoginState = attrs.postLoginState || '';
    }
  };
});
