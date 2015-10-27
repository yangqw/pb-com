'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user, $state, $window) {
    $scope.message = 'Hello ProfileCtrl';
    $scope.acceptedMsg = '';
    $scope.error = '';
    $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
      name: '', account_number:'', routing_number: '',
      country: 'US', currency: 'USD',
      domain: CareGiverEnv.spGroupName
    };

    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

    if ($user.currentUser.stripeToken){
      //Try to get payment info from api-proxy
    }

    $scope.mapStripBankAccount = function() {
      if (!$user.currentUser.stripeAccountId || !$user.currentUser.stripeToken) return
      $scope.acceptedMsg = 'Try to map your strip bank account...';

      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts/'
        + $user.currentUser.stripeAccountId + '/external-accounts';
      //var postData = { "external_account": $user.currentUser.stripeToken };
      var postData = "external_account=" + $user.currentUser.stripeToken;
      $http.post(url, postData
      ).success(function(response) {
        $user.currentUser.payment = response;
        $scope.acceptedMsg = 'Successfully map bank account to your strip tenant.';
        $('.alert').alert('close');
        console.log($scope.acceptedMsg);
      }).error(function(error){
        $scope.acceptedMsg = '';
        $scope.error = "Error while post " + url + " : " + error;
        console.log($scope.error);
      });

    };

    $scope.submit = function(){
      if (!Stripe || !Stripe.bankAccount || !Stripe.bankAccount.createToken) return;

      $scope.acceptedMsg = 'Try to strip your bank account...';
      Stripe.bankAccount.createToken($scope.formModel, function(status, response){
        if (response.error || !response.id){debugger
          $scope.error = response.error.message;
          $scope.acceptedMsg = '';
        } else {
          $scope.error = '';
          $scope.acceptedMsg = 'Successfully get your stripe bank account token...';
          if ($user && $user.currentUser) $user.currentUser.payment = response;

          // and submit to stripe account for payment method update with StripeToken;
          $user.currentUser.stripeToken = response.id;
          $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
          ).success(function(user) {
            console.log("Updated current user with stripeToken:" + $user.currentUser.stripeToken);
            $scope.mapStripBankAccount();
          });
        }
      $scope.$apply();
      });
    };

  });
