(function(){
  angular.module('caregiversComApp')
  .factory('visibleService', visible)

  visible.$inject = []

  function visible() {
    return {
      visible: {
        navbar: true,
        sidebar: true,
        footer: true
      }
    }
  }
})()
