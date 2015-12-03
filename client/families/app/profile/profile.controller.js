'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user, $state, $window, $timeout, $q) {
    $scope.acceptedMsg = '';
    $scope.cardInfo = null;
    $scope.error = '';
    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

    if ($user.currentUser.stripeToken){
      //Try to get payment info from api-proxy
    }

    $scope.mapStripToKillBill = function() {
      if (!$user.currentUser.kbAccountId || !$user.currentUser.stripeToken){
        $scope.acceptedMsg = '';
        $scope.error = "Sorry, process failed due to missing "
          + (!$user.currentUser.kbAccountId ? "Killbill Account" : "Stripe Token")
          + ", please contact administrator to fix this.";
        return;
      }

      $scope.acceptedMsg = 'Try to map your strip credit card...';

      var url = CareGiverEnv.server.host_kb + '/billing/accounts/'
            + $user.currentUser.kbAccountId + "/paymentmethods?isDefault=true";
      var postData = {
        "pluginName": "killbill-stripe",
          "pluginInfo":{
            "properties":[{
              "key":"token",
              "value": $user.currentUser.stripeToken}]
          }
      };
      $http.post(url, postData
      ).success(function(response) {
        $scope.acceptedMsg = 'Successfully map credit card to your killbill paymentmethod.';
        $timeout(function(){ $('.alert').alert('close');}, 3000);
      }).error(function(error){
        $scope.acceptedMsg = '';
        $scope.error = "Error while post " + url + " : " + error;
      });

    };

    $scope.saveCustomer = function(status, response){
      if (response.error || !response.id) {
        $scope.error = response.error.message;
        $scope.acceptedMsg = '';
      } else {
        $scope.error = '';
        $scope.acceptedMsg = 'Successfully get your stripe credit card token...';
        if ($user && $user.currentUser) $user.currentUser.payment = response;

        // and submit to killbill for payment method update with StripeToken;
        $user.currentUser.stripeToken = response.id;
        $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
        ).success(function(user) {
          $scope.getCreditCardInfo();
          $('.payment .f-right').click();
          console.log("Updated current user with stripeToken:" + $user.currentUser.stripeToken);
          $scope.mapStripToKillBill();
        });
      }
      //$scope.$apply();
    };

    $scope.getCreditCardInfo = function() {
      var op = $q.defer();
      var url = CareGiverEnv.server.host_kb + '/billing/stripe-tokens/'
        + $user.currentUser.stripeToken;
      $http.get(url).success(function(response) {
        $scope.cardInfo = response.card;
      }).error(function(error){
        $scope.processMsg = null;
        $scope.error = "Error while post " + url + " : " + error;
        op.reject();
      });
    }
    $scope.getCreditCardInfo();
    $scope.$watch('cardInfo', function() {
      $scope.hasCreditCard = !!$scope.cardInfo;
    })
  });
