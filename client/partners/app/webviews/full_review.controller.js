(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('FullReviewCtrl', FullReviewCtrl)
  .controller('FullReviewDetailCtrl', FullReviewDetailCtrl)

  FullReviewCtrl.$inject = ['$scope', '$http', '$user', "Review"];

  function FullReviewCtrl($scope, $http, $user, Review) {
    var vm = this
    vm.views = []
    vm.userName = ''

    vm.getReviews = function() {
      $user.get().then(function(user) {
        vm.userName = user.name
        Review.query({partnerId: user.partnerId}).$promise.then(function(reviews) {
          vm.reviews = reviews;
        })
      })
    }


    // vm.fullReview = {
    //   id: 1,
    //   gravatar: null,
    //   first_name: "Carrrie",
    //   last_inital: "F",
    //   hire_month: 2,
    //   reviews: []
    // }
    vm.getReviews();
  }

  FullReviewDetailCtrl.$inject = ['$scope', '$stateParams', '$state', 'Review', '$user'];

  function FullReviewDetailCtrl($scope, $stateParams, $state, Review, $user) {
    var vm = this
    vm.id = $stateParams.id
    vm.reply = ''
    vm.review = null

    Review.get({id: vm.id}, function(review) {
      vm.review = review
      $scope.review = vm.review
    })

    vm.reply2Review = function () {
      if (!!vm.reply) {
        $user.get().then(function(user) {
          Review.reply({id: vm.review._id}, {content: vm.reply, replier_id: user.partnerId }, function(response) {
            $scope.frCtrl.getReviews()
            $state.go('headless.full-review')
          })

        })

      }
    }
  }
})()
