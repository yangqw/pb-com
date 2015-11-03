'use strict';

angular.module('caregiversComApp')

.directive('cgLogout',['$auth','$state',function($auth, $state){
  return{
    link: function(scope,element){
      element.on('click',function(){
        $auth.endSession()
        .catch(function(response){
          $state.go('main');
        });
      });
    }
  };
}]);
