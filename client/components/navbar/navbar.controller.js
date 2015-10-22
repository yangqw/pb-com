'use strict';

angular.module('caregiversComApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/#/home'
    }];

    $scope.isCollapsed = true;
    $scope.isRegisterOpen = CareGiverEnv.spGroupName == 'FAMILIES';

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
