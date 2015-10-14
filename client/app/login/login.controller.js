'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user, $state, ezfb, $auth) {

    $scope.fbLogin = function () {
      /**
       * Calling FB.login with required permissions specified
       * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
       */
      ezfb.login(function (res) {
        /**
         * no manual $scope.$apply, I got that handled
         */
        if (res.authResponse) {
          var formData = {
            providerId: 'facebook',         // Get access token from FB sdk login
            accessToken: res.authResponse.accessToken
          }
            $auth.authenticate(formData)
              .then(function(){
                console.log('login success');
                $state.go('home');
              })
              .catch(function(httpResponse){
                $scope.errorMessage = response.data.message;
              });
        }
      }, {scope: 'email,public_profile'});
    };

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
          $scope.GetFromKillBill().then(function() {
            $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
                       ).success(function(user) {
                         //console.log("Update AccountID and tag at current user.kbAccount :" + account.accountId);
                         $state.go('profile');
                       });
          });
          // $http.get(CareGiverEnv.server.host_kb + '/billing/accounts?externalKey=' + $user.currentUser.contactId
          //          ).success(function(account) {
          //            //Here bind account to currentUser
          //            $user.currentUser.kbAccount = account.accountId != null;
          //            $user.currentUser.kbAccountId = account.accountId;
          //            $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser
          //                      ).success(function(user) {
          //                        console.log("Update AccountID and tag at current user.kbAccount :" + account.accountId);
          //                        $state.go('profile');
          //                      });
          //          });
        }).error(function(error){
          console.log("Error while post " + CareGiverEnv.server.host_kb + '/billing/accounts');
        });
      }
    };
    $scope.GetFromKillBill = function() {
      var op = $q.defer();
      if (!$user || !$user.currentUser || !$user.currentUser.contactId) return op.promise;

      var url = CareGiverEnv.server.host_kb + '/billing/accounts?externalKey=' + $user.currentUser.contactId;
      $http.get(url).success(function(response){
        if (!response && !response.accountId){
          $user.currentUser.kbAccount = false;
          $user.currentUser.kbAccountId = '';
        }
        else{
          $user.currentUser.kbAccount = true;
          $user.currentUser.kbAccountId = response.accountId;
        }

        op.resolve();
      }).error(function(error){
        console.log("Error while GetFromKillBill " + CareGiverEnv.server.host_kb + '/billing/accounts');
        op.reject();
      });

      return op.promise;
    };

    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = true;
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
        //Check KB account profile
        if (!$user.currentUser.kbAccount) $scope.PostToKillBill(); //create account based on contactId as externalKey
        else $scope.GetFromKillBill(); //Get kbAccountId against contactId as externalKey

        if (!$user.currentUser.stripeToken) $state.go('profile');
        else{
          $http.get(CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId)
          .success(function(contactThing) {
            if (contactThing && contactThing.content) $scope.currentContact = contactThing.content;
            else $scope.currentContact = {};
          })
        }
      }

    });

  });
