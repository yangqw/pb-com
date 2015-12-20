(function(){
  angular.module('caregiversComApp')
  .factory('Event', EventService)

  EventService.$inject = ["$rootScope", "$log"]
  function EventService($rootScope, $log) {
    var EventDispatcher = {
      event: {},
      broadcast: function(event, extraParams) {
        extraParams = extraParams || {}
        this.event.name = event
        extraParams.name = event
        this.event.timestamps = new Date();
        $log.debug("event " + this.event.name + " sent")
        $rootScope.$broadcast(this.event.name, extraParams)
      },
      on: function(event, callbackFn) {
        var self = this
        var callback = function(event, params) {
          $log.debug("event " + self.event.name + " received")
          callbackFn(event, params)
        }
        $rootScope.$on(event, callback)
      }
    }
    return EventDispatcher;
  }
})()
