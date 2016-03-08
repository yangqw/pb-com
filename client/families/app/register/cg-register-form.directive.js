'use strict';

angular.module('caregiversComApp')

.controller('CgRegistrationFormCtrl', ['$scope','$rootScope','$user','$auth','$location','$timeout','$state', '$http',
function ($scope,$rootScope,$user,$auth,$location,$timeout,$state, $http) {
  $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
    URL:''
  };
  $scope.created = false;
  $scope.enabled = false;
  $scope.creating = false;
  $scope.authenticating = false;
  $scope.submit = function(){
    $scope.creating = true;
    $scope.error = null;
    var url = CareGiverEnv.server.host_pb + CareGiverEnv.server.api_design.REGISTER_ENDPOINT;
    $http.post(url, $scope.formModel).success(function(response){
      $scope.created = true;
      $scope.creating = false;
      $scope.design = response;
    }).error(function(error) {
      $scope.creating = false;
      $scope.error = error;
      console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
    }).catch(function(response){
      $scope.creating = false;
      $scope.error = response;
    });

    // $user.create($scope.formModel)
    //   .then(function(account){
    //     $scope.created = true;
    //     $scope.creating = false;
    //   })
    //   .catch(function(response){
    //     $scope.creating = false;
    //     $scope.error = response.data.error;
    //   });
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
