'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user, Contact) {
    if ($user && $user.currentUser
    && $user.currentUser.contactId
    && !$user.currentUser.contact){
      Contact.getContact();
    }
  });
