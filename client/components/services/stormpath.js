'use strict';
//Global Stormpath Services for both domain useage
angular.module('caregiversComApp')
.service('Stormpath',["$window", "$rootScope", "$q", "$http", "$state", "$cookieStore", "$interval", "$auth", "$user",
  function($window, $rootScope, $q, $http, $state, $cookieStore, $interval, $auth, $user){
    var sessionData = {
      "remain": -1
    };
    var fightTimer = undefined;

    return self = {
      resetFight: function(seconds){
        sessionData.remain = seconds;
      },

      stopFight: function(){
        if (angular.isDefined(fightTimer)){
          $interval.cancel(fightTimer);
          fightTimer = undefined;
        }
      },

      fight: function(){
        if (angular.isDefined(fightTimer) || sessionData.remain <= 0) return;

        fightTimer = $interval(function () {
          sessionData.remain --;
          //console.log(sessionData.remain);
          if (sessionData.remain <= 5){
            $("#session-modal").modal('hide');

            $auth.endSession().then(function(){
              $rootScope.$broadcast('$notLoggedin');
            }).catch(function(){
              $rootScope.$broadcast('$sessionEnd');
              $rootScope.$broadcast('$notLoggedin');
            });

            return;
          }
          else if (sessionData.remain <= 10){
            if ($("#term-modal").hasClass('in')){
              $("#term-modal").modal('hide');
            }
            if (!$("#session-modal").hasClass('in')){
              $("#session-modal").modal({'backdrop': 'static', 'keyboard': false});
            }
          }
        }, 1000);
      },

      updateSpUser:function(){
        var op = $q.defer();
        if (!$user || !$user.currentUser)
          {op.resolve();return op.promise;}

        $rootScope.verifyMsg = null;
        var url = CareGiverEnv.server.host + '/api/users/update';
        var postData = $user.currentUser;
        $http.post(url, postData).success(function(response){
          //console.log("Updated current user with stripeToS(" + $user.currentUser.stripeToS + ")");

          op.resolve();
        }).error(function(error){
          $rootScope.posting = false;
          $rootScope.processMsg = null;
          $rootScope.verifyMsg = "Error while post " + url + " : " + error;
          op.reject();
        });

        return op.promise;
      }

    };
  }
]);
