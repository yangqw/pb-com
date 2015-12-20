(function(){
'use strict';
//Global Stormpath Services for both domain useage
angular.module('caregiversComApp')
.service('Stormpath', Session)

  Session.$inject = [
    "$window", 
    "$rootScope",
    "$q",
    "$http",
    "$state",
    "$cookieStore",
    "$interval",
    "$auth",
    "$user"
  ]

  function Session(
    $window,
    $rootScope,
    $q,
    $http,
    $state,
    $cookieStore,
    $interval,
    $auth,
    $user
  ){
    var sessionData = {
      "remain": -1
    };
    var fightTimer = undefined;

    return {
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
            $("#session-modal").closeModal();

            $auth.endSession().then(function(){
              $rootScope.$broadcast('$notLoggedin');
            }).catch(function(){
              $rootScope.$broadcast('$sessionEnd');
              $rootScope.$broadcast('$notLoggedin');
            });

            return;
          }
          else if (sessionData.remain <= 10){
            if ($('#term-modal').css('display') === "block") {
              $('#term-modal').closeModal();
            }
            if ($("#session-modal").css('display') === "none"){
              $("#session-modal").openModal({dismissible: false});
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
})()
