(function() {
  'use strict';

  angular.module('caregiversComApp')
  .controller('FullReviewCtrl', FullReviewCtrl)
  .controller('FullReviewDetailCtrl', FullReviewDetailCtrl)

  FullReviewCtrl.$inject = ['$scope', 'filterFilter'];
  FullReviewDetailCtrl.$inject = ['$scope', '$stateParams', '$state'];

  function FullReviewCtrl($scope, filterFilter) {
    var vm = this

    vm.fullReview = {
      id: 1,
      gravatar: null,
      first_name: "Carrrie",
      last_inital: "F",
      hire_month: 2,
      reviews: [
        { id: 1,
          star_rating: 1,
          created_at: moment(),
          since_hire: 2,
          content: "Erin did a good job. I can see that she was cleaning my mom's back bedroom and she also did dishes.",
          reply: 'this is good'
        },
        { id: 2,
          star_rating: 2,
          hire_month: 2,
          created_at: moment(),
          since_hire: 2,
          content: "Erin did a good job. I can see that she was cleaning my mom's back bedroom and she also did dishes.",
          reply: ''
        },
        { id: 3,
          star_rating: 4,
          hire_month: 2,
          created_at: moment(),
          since_hire: 2,
          content: "Erin did a good job. I can see that she was cleaning my mom's back bedroom and she also did dishes.",
          reply: ''
        }
      ]}
  }

  function FullReviewDetailCtrl($scope, $stateParams, $state) {
    var vm = this
    vm.id = $stateParams.id
    vm.reply = ''
    vm.review = $scope.frCtrl.fullReview.reviews.filter(function(r) {return r.id == vm.id})[0]
    $scope.review = vm.review

    vm.reply2Review = function () {
      vm.review.reply = vm.reply
      $state.go('headless.full-review')
    }
  }
})()
