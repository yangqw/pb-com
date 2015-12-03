'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http, $user, $state, $window, $q, $rootScope, $timeout) {
    $scope.error = null;
    $scope.processMsg = null; // message of sync process
    $scope.posting = false; // Is waitting for sync posting response
    $scope.toS = false; // Agree toS(terms of service) or not
    $scope.bankInfos = [];
    $scope.formModel = (typeof $scope.formModel==='object') ? $scope.formModel : {
      name: '', account_number:'', routing_number: '',
      country: 'US', currency: 'USD',
      domain: CareGiverEnv.spGroupName,
      isStaging: CareGiverEnv.isStaging === true
    };

    $scope.isSubmitable = function(){
      return !($scope.toS && !$scope.posting)
    };
    $scope.acceptTos = function() {
      $scope.toS = true;
      $('#tos-modal').modal('hide');
    }

    if (!$user || !$user.currentUser) {
      $state.go('logout');
      return;
    }

    if ($user.currentUser.stripeToken){
      //Try to get payment info from api-proxy
      $scope.toS = $user.currentUser.stripeToS === true;
    }

    $scope.mapStripeBankAccount = function() {
      var op = $q.defer();
      if (!$user.currentUser.stripeAccountId
        || !$user.currentUser.stripeToken)
        {op.resolve();return op.promise;}

      $scope.error = null;
      $scope.processMsg = 'Try to map your strip bank account...';
      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts/'
        + $user.currentUser.stripeAccountId + '/external-accounts';
      var postData = "external_account=" + $user.currentUser.stripeToken;
      $http.post(url, postData).success(function(response) {
        $user.currentUser.payment = response;
        $scope.processMsg = 'Successfully map bank account to your strip tenant.';

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.error = "Error while post " + url + " : " + error;
        op.reject();
      });

      return op.promise;
    };
    $scope.updateSpUser = function(){
      var op = $q.defer();
      if (!$user || !$user.currentUser)
        {op.resolve();return op.promise;}

      $scope.error = null;
      var url = CareGiverEnv.server.host + '/api/users/update';
      var postData = $user.currentUser;
      $http.post(url, postData).success(function(response){
        console.log("Updated current user with stripeToken(" + $user.currentUser.stripeToken
          + "), and stripeToS(" + $user.currentUser.stripeToS + ")");

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.error = "Error while post " + url + " : " + error;
        op.reject();
      });

      return op.promise;
    };
    $scope.generateStripeToken = function(){
      var op = $q.defer();
      if (!$user || !$user.currentUser
        || !Stripe || !Stripe.bankAccount
        || !Stripe.bankAccount.createToken)
        {op.resolve();return op.promise;}

      $scope.error = null;
      $scope.processMsg = 'Try to strip your bank account...';
      Stripe.bankAccount.createToken($scope.formModel, function(status, response){
        if (response.error || !response.id){
          $scope.posting = false;
          $scope.processMsg = null;
          $scope.error = response.error.message;
          $user.currentUser.payment = null;
          $user.currentUser.stripeToken = null;

          op.reject();
        } else {
          $scope.processMsg = 'Successfully get your stripe bank account token...';
          $user.currentUser.payment = response;
          $user.currentUser.stripeToken = response.id;

          op.resolve();
        }
        $scope.$apply();
      });

      return op.promise;
    };
    $scope.acceptStripeToS = function(){
      var op = $q.defer();
      if (!$user.currentUser.stripeAccountId
        || $user.currentUser.stripeToS === true)
        {op.resolve();return op.promise;}

      $scope.error = null;
      $scope.processMsg = 'Accepting strip terms of services...';
      var url = CareGiverEnv.server.host_kb +  '/billing/stripe-accounts/'
        + $user.currentUser.stripeAccountId;
      var postData = "tos_acceptance[date]=" + Math.floor(Date.now()/1000)
        + "&&tos_acceptance[ip]=" + $rootScope.location.ip;
      $http.post(url, postData).success(function(response){
        $user.currentUser.stripeToS = true;
        $scope.processMsg = 'Successfully accepted strip terms of services.';

        op.resolve();
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.error = "Error while post " + url + " : " + error;
        op.reject();
      });

      return op.promise;
    };

    $scope.bankAccountsInfo = function() {
      var op = $q.defer();
      var url = CareGiverEnv.server.host_kb + '/billing/stripe-accounts/'
        + $user.currentUser.stripeAccountId + '/external-accounts' + "?object=bank_account";
      $http.get(url).success(function(response) {
        $scope.bankInfos = response.data;
      }).error(function(error){
        $scope.posting = false;
        $scope.processMsg = null;
        $scope.error = "Error while post " + url + " : " + error;
        op.reject();
      });
    }

    $scope.submit = function(){
      $scope.posting = true;

      $scope.acceptStripeToS().then(function(){
        $scope.generateStripeToken().then(function(){
          $scope.updateSpUser().then(function(){
            $scope.mapStripeBankAccount().then(function(){
              $scope.bankAccountsInfo();
              $timeout(function(){
                $('.alert').alert('close');
                $scope.posting = false;
              }, 3000);
            });
          });
        });
      });

    };

    $scope.bankAccountsInfo();

    var init = function(){
      $('.modal-trigger').leanModal();
      $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
    }

    init();

  });
