//Global Stormpath Services for both domain useage
(function() {
  'use strict';
  angular.module('caregiversComApp')
  .factory('notificationService',  NotificationService)

  NotificationService.$inject = [
    "Event"
  ]

  function NotificationService(Event) {
    var Notification = {}
    Notification.error = function(message) {
      Event.broadcast("notification.error", {message: message})
    }

    Notification.info = function(message) {
      Event.broadcast("notification.info", {message: message})
    }

    return Notification
  }
})()
