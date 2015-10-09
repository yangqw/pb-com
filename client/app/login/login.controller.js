'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user) {
    $scope.message = 'Hello';
    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = true;
        $cookies.put('access_token', httpResponse.access_token);
      }

      if($user && $user.currentUser){
        if (!$user.currentUser.contactId){
          $http.post(CareGiverEnv.server.host + '/api/contacts/register', $user.currentUser)
          .success(function(contact){
            //Here bind contact to currentUser
            $user.currentUser.contactId = contact.id;
            $http.post(CareGiverEnv.server.host + '/api/users/update', $user.currentUser)
            .success(function(user){
              console.log(user);
            })
          });
        }

        var groups = $user.currentUser.groups;
        var isFamilyGroup = false;
        $.each(groups, function(key, value){
          if (value.href == "https://api.stormpath.com/v1/groups/BEPUSki86n0koXCSa1Yu5"){
            isFamilyGroup = true;
            return false;
          }
          return true;
        });
        if (!isFamilyGroup){
          console.log("Go to bind group Family");
        }
      }

    });

  });
