(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('AdjustAvailibiltyCtrl', AdjustAvailibiltyCtrl);

  AdjustAvailibiltyCtrl.$inject = ['$scope', 'filterFilter', "Partner", '$user', '$state'];

  function AdjustAvailibiltyCtrl($scope, filterFilter, Partner, $user, $state) {
    var vm = this;
    vm.partner = {};

    vm.hoursPerWeek = [
      {desc: '24 hours', id: 0},
       {desc: '20 or fewer hours', id: 0},
       {desc: '21 - 34 hours', id: 1},
       {desc: '35+ hours', id: 2},
    ]

    var setPartner = function() {
      $user.get().then(function(user) {
        Partner.get({id: user.partnerId},function(partner) {
          vm.partner = partner;
          var key;
          var availiabilty = partner.availiabilty;

          var availables = availability ? availability.split(',') : [];
          for (key in vm.availibiltyInfo.days) {
            if (availables.indexOf(key) >= 0) {
              vm.availibiltyInfo.days[key].status = true
            }
          }
        })
      })
    }

    vm.hoursPerWeekDesc = vm.hoursPerWeek[0].desc

    vm.availibiltyInfo = {
      days: {
        'sun': {status: false, display: "s"},
        'mon': {status: false, display: "m"},
        'tue': {status: false, display: "t"},
        'wed': {status: false, display: "w"},
        'thu': {status: false, display: "t"},
        'fri': {status: false, display: "f"},
        'sat': {status: false, display: "s"}
      },
      hoursPerWeek: 0
    }

    $scope.$watch('', function() {
      $('.hours').dropdown();
    })


    var setHoursPerWeekDesc = function(option) {
      for (var i in vm.hoursPerWeek) {
        if (vm.hoursPerWeek[i].id === option.id) {
          vm.hoursPerWeekDesc = option.desc
        }
      }
    }

    var toggleDay = function(day) {
      vm.availibiltyInfo.days[day].status = !vm.availibiltyInfo.days[day].status
    }

    var savePartner = function() {
      var days = []
      var key
      for (key in vm.availibiltyInfo.days) {
        if (vm.availibiltyInfo.days[key].status === true) {
          days.push(key)
        }
      }
      vm.partner.availability = days.join(',')
      vm.partner.availabilityHours = vm.hoursPerWeekDesc
      vm.partner.$save(function() {
        $state.go('headless.adjust-availiabilty-done')
      })
    }

    vm.toggleDay = toggleDay;
    vm.savePartner = savePartner;

    vm.selectHoursPerWeek = function(option) {
      vm.availibiltyInfo.hoursPerWeek = option.id
      setHoursPerWeekDesc(option)
    }

    setPartner();
  }

})()
