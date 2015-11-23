'use strict';

angular.module('caregiversComApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $http, $user, $state, $window, $timeout, Stormpath, Killbill) {
    $scope.editingPayment = false;
    $rootScope.acceptedMsg = '';
    $rootScope.error = '';
    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

    $scope.togglePaymentEdit = function(){
      $scope.editingPayment = !$scope.editingPayment;

      if(!$('.ccjs-csc-diagram-wrapper').hasClass('ccjs-active'))
        $(".ccjs-csc-help").click();
    };

    $scope.onGotStripeToken = function(status, response){
      if (response.error || !response.id) {
        $rootScope.error = response.error.message;
        $rootScope.acceptedMsg = '';
      } else {
        $rootScope.error = '';
        $rootScope.acceptedMsg = 'Successfully get your stripe credit card token...';
        if ($user && $user.currentUser) $user.currentUser.payment = response;

        // and submit to killbill for payment method update with StripeToken;
        $user.currentUser.stripeToken = response.id;
        Stormpath.updateSpUser().then(function(){
          console.log("Updated current user with stripeToken:" + $user.currentUser.stripeToken);
          Killbill.mapStripToKillBill().then(function(){
            $timeout(function(){
              $('.alert').alert('close');
              $('.card-reveal .card-title').click();
            }, 3000);
          });
        });
      }
    };
  });
