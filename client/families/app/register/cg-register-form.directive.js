'use strict';

angular.module('caregiversComApp')

.controller('CgRegistrationFormCtrl', ['$scope','$rootScope','$user','$auth','$location','$timeout','$state',
function ($scope,$rootScope,$user,$auth,$location,$timeout,$state) {
  $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
    givenName:'',
    surname: '',
    email: '',
    password: '',
    domain: CareGiverEnv.spGroupName,
    isStaging: CareGiverEnv.isStaging === true
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
        if($scope.enabled){
          $scope.creating = false;

          $timeout(function(){
          $rootScope.isAutoLogin = true;
          $state.go('login');

          $scope.authenticating = true;
          $auth.authenticate({
            username: $scope.formModel.email,
            password: $scope.formModel.password,
            domain: CareGiverEnv.spGroupName,
            isStaging: CareGiverEnv.isStaging === true
          })
          .then(function(){
            if($scope.postLoginPath){
              $location.path($scope.postLoginPath);
            }
          })
          .catch(function(response){
            $rootScope.posting = false;
            $rootScope.error = response.data && response.data.error || 'XHR Error';
          })
          .finally(function(){
            $scope.authenticating = false;
            $scope.creating = false;
          });

          },2000);
        }else{
          $scope.creating = false;
        }
      })
      .catch(function(response){
        $scope.creating = false;
        $scope.error = response.data.error;
        if (response.status == 400 && response.data
        && response.data.status == 409 && response.data.code == 2001){
          $scope.error = "Account with that email already exists.";
          $scope.emailExists = true;
        }
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
