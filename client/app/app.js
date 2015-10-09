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
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);

    if(Stripe && Stripe.setPublishableKey){
      Stripe.setPublishableKey('pk_test_d1aKYweI07SGiH1OUk1Jr10t');
    }

    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = false;
  })
  .run(function($stormpath){
    $stormpath.uiRouter({
        loginState: 'login',
        defaultPostLoginState: 'main'
    });
  });
