'use strict';

angular.module('caregiversComApp')
  .controller('SignupCtrl', ['$scope','$http','$location','$user',function ($scope,$http,$location,$user) {
    $scope.message = 'Hello SignupCtrl';
    $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
      givenName:'',
      surname: '',
      email: '',
      password: '',
      partnerId: '',
      domain: CareGiverEnv.spGroupName
    };
    $scope.verifySignupToken = function(){
      return $http.get(CareGiverEnv.server.host+'/partners/fetch?token='+token);
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

    if(typeof token==='string'){
      $scope.verifying = true;
      $scope.verifySignupToken(token)
        .then(function(response){
          $scope.verified = true;
          $scope.formModel.givenName = response.data.firstName;
          $scope.formModel.surname = response.data.lastName;
          $scope.formModel.email = response.data.email;
          $scope.formModel.partnerId = response.data.id;
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
  }]);
