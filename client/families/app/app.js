(function() {
  'use strict';

angular.module('caregiversComApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'stormpath',
  'stormpath.templates',
  'stripe',
  'ezfb',
  'ui.materialize',
  'angularFileUpload',
  'jsonFormatter',
  'cb.x2js'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;

  })

  .run(function($stormpath){
    $stormpath.uiRouter({
        autoRedirect: false,
        //defaultPostLoginState: 'main',
        //forbiddenState: 'forbidden',
        loginState: 'login'
    });
  })

  // .factory('$exceptionHandler', function () {
  //   return function (exception) {
  //     if (window.location.port == 9333){
  //       throw exception;
  //     }
  //     else {
  //       Raygun.send(exception);
  //     }
  //   }
  // })
})()
