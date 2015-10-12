'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user) {
    //$scope.message = 'Hello';
    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = false;
        $cookies.put('access_token', httpResponse.access_token);
      }

      if (!$user || !$user.currentUser) return;

      //Check group belongs
      var groups = $user.currentUser.groups;
      var isFamilyGroup = false;
      $.each(groups, function(key, value){
        if (value.href == "https://api.stormpath.com/v1/groups/BEPUSki86n0koXCSa1Yu5"){
          isFamilyGroup = true;
          return false;
        }
        return true;
      });
      if (!isFamilyGroup){console.log("Go to bind group Family");}

      //Check contact profile, create one if NA throuht API server based on logged user info
      if (!$user.currentUser.contactId){
        $http.post(CareGiverEnv.server.host + '/contacts/register', $user.currentUser)
        .success(function(contact){
          //Here bind contact to currentUser
          $user.currentUser.contactId = contact.id;
          $http.post(CareGiverEnv.server.host + '/users/update', $user.currentUser)
          .success(function(user){
            console.log("Update ContactID and store in current user.contactId" + $user.currentUser.contactId);
          })
        });
      }

      //Check account profile, create one if NA through KB server based on contactId as externalKey
      if (!$user.currentUser.accountId){
        var accountData = {
          "accountId": "",
          "name": $user.currentUser.fullName,
          "email": $user.currentUser.email,
          "externalKey": $user.currentUser.contactId,
          "currency": "USD"
        };
        $http.post(CareGiverEnv.server.host_kb + '/accounts', accountData, {
          headers: {
            "X-Killbill-CreatedBy": "CaregiversComApp",
            "X-Killbill-Reason": "Register an account for family contact",
            "X-Killbill-Comment": "Works while family user login and no related account found."
          }
        }).success(function() {
          //Get accountId from KB
          $http.get(CareGiverEnv.server.host_kb + 'accounts?externalKey=' + $user.currentUser.contactId
            + '&accountWithBalance=false&accountWithBalanceAndCBA=false&audit=NONE'
          ).success(function(account) {
            //Here bind account to currentUser
            $user.currentUser.accountId = account.accountId;
            $http.post(CareGiverEnv.server.host + '/users/update', $user.currentUser
            ).success(function(user) {
              console.log("Update AccountID and store in current user.accountId:" + $user.currentUser.accountId);
            });
          });
        }).error(function(error){
          console.log("Error while post " + CareGiverEnv.server.host_kb + '/accounts');
        });
      }

    });

  });
