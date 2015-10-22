'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user, $state, $window) {
    $scope.message = 'Hello ProfileCtrl';
    $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
      number:'',
      name: '',
      domain: CareGiverEnv.spGroupName
    };

    if (!$user || !$user.currentUser) {
      $state.go('login');
      return;
    }

    if ($user.currentUser.stripeToken){
      //Try to get payment info from api-proxy
    }
    $scope.submit = function(){
    };

    $scope.saveCustomer = function(status, response){
      if (response.error || !response.id) {// Show the errors on the form
        $scope.error = response.error.message;
      } else {
        $scope.error = '';
        // response contains id and card, which contains additional card details
        if ($user && $user.currentUser) $user.currentUser.payment = response;
        var token = response.id;

        // and submit to killbill for payment method update with StripeToken;
        $user.currentUser.stripeToken = token;
        $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
        ).success(function(user) {
          console.log("Updated current user with stripeToken:" + $user.currentUser.stripeToken);
          $scope.mapStripToKillBill();
        });
      }
    };

  });
