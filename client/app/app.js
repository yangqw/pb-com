'use strict';

angular.module('caregiversComApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'stormpath',
  'stormpath.templates',
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })
  .config(function(STORMPATH_CONFIG){
    STORMPATH_CONFIG.ENDPOINT_PREFIX = 'http://localhost:9000';
  })
  .run(function($stormpath){
    $stormpath.uiRouter({
        loginState: 'login',
        defaultPostLoginState: 'main'
    });
  });
