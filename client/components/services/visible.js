(function(){
  angular.module('caregiversComApp')
  .factory('visibleService', visible)
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
