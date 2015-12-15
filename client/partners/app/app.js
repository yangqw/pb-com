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
          template: "<div class=\"mobile-view\" ui-view><a ui-sref=\"headless.adjust-availiabilty\">Adjust Availiabilty</a></br><a ui-sref=\"headless.request-for-backup\">Request for Backup</a></br><a ui-sref=\"headless.full-review\">Full Review</a></div>"
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
