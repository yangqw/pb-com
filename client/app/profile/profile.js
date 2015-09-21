'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        sp:{
          authenticate: true,
          authorize: {
            group: 'ROLE_ADMINS_CAREGIVERS'
          }
        }
      });
  });
