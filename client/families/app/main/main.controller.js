'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user, Contact) {
    //console.log('MainCrtl');

    if ($user && $user.currentUser
    && $user.currentUser.contactId
    && !$user.currentUser.contact){
      Contact.getContact();
    }
  });
