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
;'use strict';
//Base controller, one purpose is going to set access_token to http headers
angular.module('caregiversComApp')
  .controller('ApplicationCtl', function ($scope, $http, $cookies) {
    //console.log("ApplicationCtl");
    if ($cookies.get('access_token')) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get('access_token');
        $http.defaults.headers.common.withCredentials = false;
    }
  });
;'user strict'

angular.module('caregiversComApp')
  .config(function(STORMPATH_CONFIG){
    //console.log("********AppConfig********");
    if (CareGiverEnv) {// Overwrite STORMPATH_CONFIG keys if found definition at GareGiverEnv
      STORMPATH_CONFIG.ENDPOINT_PREFIX = CareGiverEnv.server.host;
      angular.forEach(CareGiverEnv.server.accesspoint, function(value, key) {
        STORMPATH_CONFIG[key] = value;
      })
    }
  });
;'use strict';

angular.module('caregiversComApp')
  .controller('EmailVerificationCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
;'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('emailVerification', {
        url: '/register/verify?sptoken',
        templateUrl: 'app/emailVerification/emailVerification.html',
        controller: 'EmailVerificationCtrl'
      });
  });
;'use strict';

angular.module('caregiversComApp')
  .controller('LoginCtrl', function ($scope, $http, $cookies, $user) {
    $scope.message = 'Hello';
    $scope.$on('$authenticated', function(event, httpResponse) {
      if (httpResponse && httpResponse.access_token){
        $http.defaults.headers.common.Authorization = 'Bearer ' + httpResponse.access_token;
        $http.defaults.headers.common.withCredentials = false;
        $cookies.put('access_token', httpResponse.access_token);
      }

      if($user && $user.currentUser){
        if (!$user.currentUser.contactId){
          $http.post(CareGiverEnv.server.host + '/v1/contacts/register', $user.currentUser)
          .success(function(contact){
            //Here bind contact to currentUser
            $user.currentUser.contactId = contact.id;
            $http.post(CareGiverEnv.server.host + '/v1/users/update', $user.currentUser)
            .success(function(user){
              console.log(user);
            })
          });
        }

        var groups = $user.currentUser.groups;
        var isFamilyGroup = false;
        $.each(groups, function(key, value){
          if (value.href == "https://api.stormpath.com/v1/groups/BEPUSki86n0koXCSa1Yu5"){
            isFamilyGroup = true;
            return false;
          }
          return true;
        });
        if (!isFamilyGroup){
          console.log("Go to bind group Family");
        }
      }

    });

  });
;'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      });
  });;'use strict';

angular.module('caregiversComApp')
  .controller('MainCtrl', function ($scope, $http, $rootScope, $user) {
    //console.log('MainCrtl');
    $scope.awesomeThings = [];
    if ($user && $user.currentUser){
      $http.get(CareGiverEnv.server.host + '/v1/contacts', {withCredentials: true}
      ).success(function(awesomeThings) {
        $scope.awesomeThings = awesomeThings;

        $.each(awesomeThings.content, function(key, value){
          if (value.id == $user.currentUser.contactId){
            $scope.currentContact = value;
            return false;
          }
          return true;
        });
      });
    }
  });
;'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        sp:{
          waitForUser: true
        }
      });
  });
;'use strict';

angular.module('caregiversComApp')
  .controller('PasswordResetCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
;'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('passwordReset', {
        url: '/password/reset?sptoken',
        templateUrl: 'app/passwordReset/passwordReset.html',
        controller: 'PasswordResetCtrl'
      });
  });
;'use strict';

angular.module('caregiversComApp')
  .controller('PasswordResetRequestCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
;'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('passwordResetRequest', {
        url: '/password/requestReset',
        templateUrl: 'app/passwordResetRequest/passwordResetRequest.html',
        controller: 'PasswordResetRequestCtrl'
      });
  });;'use strict';

angular.module('caregiversComApp')
  .controller('ProfileCtrl', function ($scope, $http) {
    $scope.message = 'Hello';
    $scope.saveCustomer = function(status, response){
      //debugger;
      var $form = $('#payment-form');
      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
      } else {
        // response contains id and card, which contains additional card details
        var token = response.id;
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        // and submit

        $form.find('.payment-errors').text("POST to killbill for payment method with StripeToken:" + token);
      }
    };
  });
;'use strict';

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
;'use strict';

angular.module('caregiversComApp')
  .controller('RegisterCtrl', function ($scope) {
    $scope.message = 'Hello';
  });
;'use strict';

angular.module('caregiversComApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/register',
        templateUrl: 'app/register/register.html',
        controller: 'RegisterCtrl'
      });
  });;'use strict';

angular.module('caregiversComApp')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Cancel',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      }
    };
  });
;'use strict';

angular.module('caregiversComApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });