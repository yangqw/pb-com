'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account', {
        url: '/account',
        templateUrl: 'families/app/account/account.html',
        controller: 'AccountCtrl',
        sp:{
          authenticate: true,
          // authorize: {
          //   group: 'ROLE_ADMINS_CAREGIVERS'
          // }
        }
      });
  });
