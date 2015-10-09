'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $scope.saveCustomer = function(status, response){
      //debugger;
      var $form = $('#payment-form');
      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
      } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // and submit

        $form.find('.payment-errors').text("POST to killbill for payment method with StripeToken:" + token);
      }
    };
  });
