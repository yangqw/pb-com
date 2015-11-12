'use strict';

angular.module('caregiversComApp')
  .controller('SignupCtrl', ['$scope','$http','$location','$user','$state','$auth', '$timeout','$rootScope',
  function ($scope,$http,$location,$user,$state,$auth,$timeout,$rootScope) {
    $scope.message = 'Hello SignupCtrl';
    $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
      givenName:'',
      surname: '',
      email: '',
      password: '',
      partnerId: '',
      domain: CareGiverEnv.spGroupName,
      isStaging: CareGiverEnv.isStaging === true
    };
    $scope.partnerModel = {};
    $scope.verifySignupToken = function(){
      return $http.get(CareGiverEnv.server.host+'/partners/fetch?token='+token);
    };
    $scope.updatePartner = function(){
      return $http.put(CareGiverEnv.server.host+'/partners/',$scope.partnerModel);
    };

    var token = $location.search().token;
    $scope.showVerificationError = false;
    $scope.verifying = false;
    $scope.verified = false;
    $scope.posting = false;
    $scope.reset = false;
    $scope.created = false;
    $scope.enabled = false;
    $scope.creating = false;
    $scope.authenticating = false;
    $scope.error = null;
    $scope.emailExists = false;

    if(typeof token==='string'){
      $scope.verifying = true;
      $scope.verifySignupToken(token)
        .then(function(response){
          if (!response || response.status == 406
          || !response.data || !response.data.email || !response.data.token){
            $scope.showVerificationError = true;
            return;
          }

          $scope.verified = true;
          $scope.formModel.givenName = response.data.firstName;
          $scope.formModel.surname = response.data.lastName;
          $scope.formModel.email = response.data.email;
          $scope.formModel.partnerId = response.data.token;
          $scope.partnerModel = response.data;
        })
        .catch(function(){
          $scope.showVerificationError = true;
        })
        .finally(function(){
          $scope.verifying = false;
        });
    }else{
      $scope.showVerificationError = true;
    }
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
  }]);
