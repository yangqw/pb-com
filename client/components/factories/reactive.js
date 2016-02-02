'use strict';
// I provide a focus method that is used to move focus on a specified element.
angular.module('caregiversComApp')
.factory('focus', function($timeout, $window) {
  return function(id){
    $timeout(function(){
      var element = $window.document.getElementById(id);
      if (element) element.focus();
    });
  };
});
