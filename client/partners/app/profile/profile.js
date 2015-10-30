'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'partners/app/profile/profile.html',
        controller: 'ProfileCtrl',
        sp:{
          authenticate: true
          // waitForUser: true
          // authorize: {
          //   group: 'ROLE_ADMINS_CAREGIVERS'
          // }
        }
      });
  });
