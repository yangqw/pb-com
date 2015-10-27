'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user, $state, $window) {
    $scope.acceptedMsg = '';
    $scope.error = '';

    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

    if ($user.currentUser.stripeToken){
      //Try to get payment info from api-proxy
    }

    $scope.mapStripToKillBill = function() {
      if (!$user.currentUser.kbAccountId || !$user.currentUser.stripeToken) return;
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
        $('.alert').alert('close');
        console.log($scope.acceptedMsg);
      }).error(function(error){
        $scope.acceptedMsg = '';
        $scope.error = "Error while post " + url + " : " + error;
        console.log($scope.error);
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
          console.log("Updated current user with stripeToken:" + $user.currentUser.stripeToken);
          $scope.mapStripToKillBill();
        });
      }
      //$scope.$apply();
    };

  });
