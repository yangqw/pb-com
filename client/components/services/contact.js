'use strict';
//Global Killbill Services for both domain useage
angular.module('caregiversComApp')
.service('Contact',["$window", "$rootScope", "$q", "$http", "$state", "$cookieStore", "$interval", "$auth", "$user", "Stormpath",
  function($window, $rootScope, $q, $http, $state, $cookieStore, $interval, $auth, $user, Stormpath){

    return self = {
      getContact: function(){
        var op = $q.defer();
        if ($user.currentUser.contact) {op.resolve();return op.promise;}
        if (!$user.currentUser.contactId) {op.reject();return op.promise;}

        var url = CareGiverEnv.server.host + '/contacts/' + $user.currentUser.contactId;
        $http.get(url).success(function(response) {
          if (!response || !response.content){
            op.reject();
          }
          else{
            $user.currentUser.contact = response.content;
            op.resolve();
          }
        });

        return op.promise;
      },
      createContact: function(){
        var op = $q.defer();
        if ($user.currentUser.contactId) {op.resolve();return op.promise;}
        if (!$user.currentUser.email) {op.reject();return op.promise;}

        $rootScope.posting = true;
        $rootScope.processMsg = "Seems this is your first login, let\'s setup contact profile for you, a moment please...";
        $rootScope.verifyMsg = null;
        var url = CareGiverEnv.server.host + '/contacts';
        var data = {
          "firstName" : $user.currentUser.surname,
          "lastName" : $user.currentUser.givenName,
          "email": $user.currentUser.email
        };
        $http.post(url, data).success(function(response) {
          $user.currentUser.contactId = response.content._id;
          $rootScope.processMsg = "Contact profile has been created sucessfully.";

          Stormpath.updateSpUser().then(function(){
            console.log("Update ContactId and tag at current user.contactId :" + $user.currentUser.contactId);
          });

          op.resolve();
        }).error(function(error) {
          $rootScope.posting = false;
          $rootScope.processMsg = null;
          $rootScope.verifyMsg = ("Error while post " + url + ":") + (error && (error.causeMessage || error.message) || 'XHR Error');
          op.reject();
        });

        return op.promise;
      }
    };
  }
]);
