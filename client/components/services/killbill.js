'use strict';
//Global Killbill Services for both domain useage
angular.module('caregiversComApp')
.service('Killbill',["$window", "$rootScope", "$q", "$http", "$state", "$cookieStore", "$interval", "$auth", "$user", "Stormpath", "$timeout", "translate",
  function($window, $rootScope, $q, $http, $state, $cookieStore, $interval, $auth, $user, Stormpath, $timeout, translate){

    var self;

    return self = {
      getKbAccount: function(){
        var op = $q.defer();
        if ($user.currentUser.kbAccountId) {op.resolve();return op.promise;}
        if (!$user.currentUser.contactId) {op.reject();return op.promise;}

        $rootScope.posting = true;
        $rootScope.processMsg = translate.killbill.get.posting;
        $rootScope.verifyMsg = null;
        var url = CareGiverEnv.server.host_kb + '/billing/accounts?externalKey=' + $user.currentUser.contactId;
        $http.get(url).success(function(response){
          if (!response || !response.accountId){
            $user.currentUser.kbAccount = false;
            $user.currentUser.kbAccountId = '';

            $rootScope.posting = false;
            $rootScope.processMsg = null;
            $rootScope.verifyMsg = translate.killbill.get.success + response.message;
            op.reject();
          }
          else{
            console.log("Get AccountID from killbill :" + response.accountId);
            $user.currentUser.kbAccount = true;
            $user.currentUser.kbAccountId = response.accountId;
            op.resolve();
          }

        }).error(function(error){
          $rootScope.posting = false;
          $rootScope.processMsg = null;
          console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'))
          $rootScope.verifyMsg = translate.killbill.get.error;
          op.reject();
        });

        return op.promise;

      },

      createKbAccount: function(){
        var op = $q.defer();
        if ($user.currentUser.kbAccount) {op.resolve();return op.promise;}
        if (!$user.currentUser.email || !$user.currentUser.contactId) {op.reject();return op.promise;}

        $rootScope.posting = true;
        $rootScope.processMsg = translate.killbill.create.posting;
        $rootScope.verifyMsg = null;
        var url = CareGiverEnv.server.host_kb + '/billing/accounts';
        var data = {
          "name": $user.currentUser.fullName,
          "email": $user.currentUser.email,
          "externalKey": $user.currentUser.contactId,
          "currency": "USD"
        };
        $http.post(url, data).success(function() {
          $rootScope.processMsg = translate.killbill.create.success;

          self.getKbAccount().then(function(){
            Stormpath.updateSpUser().then(function(){
            console.log("Update AccountID and tag at current user.kbAccount :" + $user.currentUser.kbAccountId);
            });

            op.resolve();
          });
        }).error(function(error) {
          $rootScope.posting = false;
          $rootScope.processMsg = null;
          console.log(("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error'));
          $rootScope.verifyMsg = translate.killbill.create.error;
          op.reject();
        });

        return op.promise;
      },

      mapStripToKillBill : function(){
        var op = $q.defer();

        if (!$user.currentUser.kbAccountId || !$user.currentUser.stripeToken){
          $rootScope.acceptedMsg = '';
          $rootScope.error = "Sorry, process failed due to missing "
            + (!$user.currentUser.kbAccountId ? "Killbill Account" : "Stripe Token")
            + ", please contact administrator to fix this.";

          op.reject();
          return op.promise;
        }

        $rootScope.acceptedMsg = 'Try to map your strip credit card...';
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
        $http.post(url, postData).success(function(response) {
          $rootScope.acceptedMsg = 'Successfully map credit card to your killbill paymentmethod.';

          op.resolve();
        }).error(function(error){
          $rootScope.acceptedMsg = '';
          $rootScope.error = "Error while post " + url + " : " + error;

          op.reject();
        });

        return op.promise;
      }
    };

  }
]);
