'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state) {
    $scope.message = 'Hello';
    $scope.PostToKillBill = function() {
      if ($user.currentUser.contactId){
        var accountData = {
          "name": $user.currentUser.fullName,
          "email": $user.currentUser.email,
          "externalKey": $user.currentUser.contactId,
          "currency": "USD"
        };
        $http.post(CareGiverEnv.server.host_kb + '/billing/accounts', accountData, {
        }).success(function() {
          //Get accountId from KB
          $http.get(CareGiverEnv.server.host_kb + '/billing/accounts?externalKey=' + $user.currentUser.contactId
                    // + '&accountWithBalance=false&accountWithBalanceAndCBA=false&audit=NONE'
                   ).success(function(account) {
                     //Here bind account to currentUser
                     $user.currentUser.kbAccountId = account.accountId;
                     $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
                               ).success(function(user) {
                                 console.log("Update AccountID and store in current user.accountId:" + $user.currentUser.kbAccountId);
                                 $state.go('profile');
                               });
                   });
        }).error(function(error){
          console.log("Error while post " + CareGiverEnv.server.host_kb + '/accounts');
        });
      }
    };
    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = false;
        $cookies.put('access_token', httpResponse.access_token);
      }
      if (!$user || !$user.currentUser) return;

      //Check group belongs
      // var groups = $user.currentUser.groups;
      // var isFamilyGroup = false;
      // $.each(groups, function(key, value){
      //   if (value.href == "https://api.stormpath.com/v1/groups/BEPUSki86n0koXCSa1Yu5"){
      //     isFamilyGroup = true;
      //     return false;
      //   }
      //   return true;
      // });
      // if (!isFamilyGroup){console.log("Go to bind group Family");}

      //Check contact profile, create one if NA throuht API server based on logged user info
      if (!$user.currentUser.contactId){
        var contactData = {
          "firstName" : $user.currentUser.surname,
          "lastName" : $user.currentUser.givenName,
          "email": $user.currentUser.email
        };
        $http.post(CareGiverEnv.server.host + '/contacts', contactData)
        .success(function(contact){
          //Here bind contact to currentUser
          $user.currentUser.contactId = contact.content._id;
          $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser)
          .success(function(user){
            console.log("Update ContactID and store in current user.contactId" + $user.currentUser.contactId);
            $scope.PostToKillBill();
          })
        });
      }
      else{
        if (!$user.currentUser.kbAccountId) $scope.PostToKillBill();
        if (!$user.currentUser.stripeToken) $state.go('profile');
        $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
        .success(function(contactThing) {
          if (contactThing && contactThing.content) $scope.currentContact = contactThing.content;
          else $scope.currentContact = {};
        })
      }
      //Check account profile, create one if NA through KB server based on contactId as externalKey

    });

  });
