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
  .controller('LoginCtrl', function ($scope) {
    $scope.message = 'Hello';
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
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

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
  .controller('ProfileCtrl', function ($scope) {
    $scope.message = 'Hello';
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