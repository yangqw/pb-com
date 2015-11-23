'use strict';

angular.module('caregiversComApp')
  .controller('AccountCtrl', function ($scope, $http, $user, $state, $window, $timeout) {
    $scope.editingPayment = false;

    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

    $scope.togglePaymentEdit = function(){
      $scope.editingPayment = !$scope.editingPayment;

      if(!$('.ccjs-csc-diagram-wrapper').hasClass('ccjs-active'))
        $(".ccjs-csc-help").click();
    };

  });
