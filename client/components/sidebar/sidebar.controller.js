angular.module('caregiversComApp')
.controller('SidebarCtrl', function ($scope, $http, $location, $rootScope, $cookies, $user, $state, $q, $timeout, Stormpath, $auth) {
  $scope.menu = [{
    'title': 'Home',
    'link': '/'
  }];

  $scope.isRegisterOpen = CareGiverEnv.spGroupName == 'FAMILIES';
  $scope.profileTitle = CareGiverEnv.spGroupName == 'FAMILIES' ? 'Profile': 'Billing';
  $scope.hasTimeSheet = CareGiverEnv.spGroupName == 'FAMILIES';

  $scope.isActive = function(route) {
    if(route === '/') {
      return route === $location.path();
    } else {
      return RegExp(route).test($location.path());
    }
  };

  $scope.init = function() {
    $(".button-collapse").sideNav({
      closeOnClick: true
    });
  }

  $scope.init();
})
