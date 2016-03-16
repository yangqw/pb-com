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
})
.factory('process', function() {
  var tickets = [];
  var randStrLength = 10;

  var factory = {};
  factory.requestTicket = function(name){
    var match = {'name': name};
    match.seat = randStr(randStrLength);
    match.timestamp = Date.now()/1000 | 0;
    tickets.push(match);

    //console.log("Request Tickets:" + JSON.stringify(tickets, null, 2));
    return match;
  };
  factory.isValidTicket = function(ticket){
    var matches = getTicketsByName(ticket.name);
    if (angular.isUndefined(matches)) return true;

    if (matches.length > 0) matches = factory.reduceTicketByName(ticket.name);

    //console.log("Check remaining tickets:" + JSON.stringify(matches, null, 2));
    return matches.length == 0;
  };
  factory.reduceTicketByName = function(name){
    var matchIdx = -1;
    var result = [];
    angular.forEach(tickets, function(ticket, idx) {
      if (ticket.name === name) {
          if (matchIdx < 0) matchIdx = idx;
          else this.push(ticket);
      }
    }, result);
    if (matchIdx >= 0) {
      //console.log("Reduce Tickets at:" + matchIdx);
      tickets.splice(matchIdx, 1);
      //console.log("Reduced Tickets:" + JSON.stringify(tickets, null, 2));
    }

    return result;
  }

  function getTicketsByName(name){
    return $.grep(tickets, function(ticket, idx){
      return (ticket.name === name);
    });
  }

  function randStr(x){
    var s = "";
    while(s.length < x && x > 0) {
      var r = Math.random();
      s += (r<0.1
        ? Math.floor(r*100)
        : String.fromCharCode(Math.floor(r*26) + (r<0.5?97:65)));
    }
    return s;
  }

  return factory;
});
