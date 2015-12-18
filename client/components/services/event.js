angular.module('eventDispatcher',[])
.factory('Event', ['$rootScope', '$log', function($rootScope, $log) {
  var EventDispatcher = {
    event: {},
    broadcast: function(event) {
      this.event = event;
      this.event.timestamps = new Date();
      $log.debug(this.event.name)
      $rootScope.$broadcast(this.event.name, this.event)
    }
  }
  return EventDispatcher;
}])
