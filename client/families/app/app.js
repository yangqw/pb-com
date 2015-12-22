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
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;

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
      if (window.location.port == 9333){
        throw exception;
      }
      else {
        Raygun.send(exception);
      }
    }
  })
  .run(['$rootScope','visibleService',  function($rootScope, visibleService) {
    $rootScope.$on('$stateChangeStart', function(e,toState,toParams){
      var defaultVisibles = {
        navbar: true,
        sidebar: true,
        footer: true
      }
      defaultVisibles = angular.extend(defaultVisibles, toState.visible || {})
      // visibleService.visible = defaultVisibles;
      visibleService.visible.navbar = defaultVisibles.navbar
      visibleService.visible.sidebar = defaultVisibles.sidebar
      visibleService.visible.footer = defaultVisibles.footer
      // Event.broadcast('navbar.visible', {state: defaultVisibles.navbar})
    })
  }])
})()
