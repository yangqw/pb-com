'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user, $state, $window) {
    $scope.message = 'Hello ProfileCtrl';
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

      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts/'
        + $user.currentUser.stripeAccountId + '/external-accounts';
      //var postData = { "external_account": $user.currentUser.stripeToken };
      var postData = "external_account=" + $user.currentUser.stripeToken;
      $http.post(url, postData
      ).success(function(response) {
        console.log("Successfully map bank account to strip account");
      }).error(function(error){
        console.log("Error while post " + url + ":" + error);
      });

    };

    $scope.submit = function(){
      if (!Stripe || !Stripe.bankAccount || !Stripe.bankAccount.createToken) return;

      Stripe.bankAccount.createToken($scope.formModel, function(status, response){
        if (response.error || !response.id){
          $scope.error = response.error.message;
        } else {
          $scope.error = '';

          if ($user && $user.currentUser) $user.currentUser.payment = response;
          var token = response.id;

          // and submit to stripe account for payment method update with StripeToken;
          $user.currentUser.stripeToken = token;
          $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
          ).success(function(user) {
            console.log("Updated current user with stripeToken:" + $user.currentUser.stripeToken);
            $scope.mapStripBankAccount();
          });
        }
      });
    };

  });
