'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user) {
    if (!$user || !$user.currentUser) return;
    $scope.mapStripToKillBill = function() {
      if ($user.currentUser.kbAccountId && $user.currentUser.stripeToken) {
        var postData = {
          "pluginName": "killbill-stripe",
            "pluginInfo":{
              "properties":[{
                "key":"token",
                "value": $user.currentUser.stripeToken}]
            }
        };
        $http.post(CareGiverEnv.server.host + '/billing/accounts/' + $user.currentUser.kbAccountId + "/paymentMethods?isDefault=true", postData
                  ).success(function(response) {
                    console.log("successfully map strip to killbill paymentmethod");
                    console.log(response);
                  });
      }
    };

    $scope.saveCustomer = function(status, response){
      //debugger;
      var $form = $('#payment-form');
      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
      } else {
        // response contains id and card, which contains additional card details

        if ($user && $user.currentUser) $user.currentUser.payment = response;
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // and submit
        $form.find('.payment-errors').text("POST to killbill for payment method with StripeToken:" + token);
        $user.currentUser.stripeToken = token;
        $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
                  ).success(function(user) {
                    console.log("Update Strip and store in current user.stripeToken:" + $user.currentUser.stripeToken);
                    $scope.mapStripToKillBill();
                  });
      }
    };

  });
