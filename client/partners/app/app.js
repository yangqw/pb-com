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
  'ezfb'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;

    // add a global headless state
    //
    $stateProvider
    .state('headless', {
      url: '/headless',
      views: {
        'base': {
          template: "<div class=\"mobile-view\" ui-view></div>"
        }
      }
    })
  })

  .run(function($stormpath){
    $stormpath.uiRouter({
        autoRedirect: true,
        //defaultPostLoginState: 'main',
        //forbiddenState: 'forbidden',
        loginState: 'login'
    });
  })
  .factory('$exceptionHandler', function () {
    return function (exception) {
      if (window.location.port == 9334){
        throw exception;
      }
      else {
        Raygun.send(exception);
      }
    }
  });
