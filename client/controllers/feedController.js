(function () {

    var injectParams = ['$scope', '$location', '$filter', '$window',
        '$timeout', 'authService', 'dataService', 'modalService'];

    var FeedController = function ($scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        $scope.feeds = [];

        function init() {

        }

        init();
    };

    FeedController.$inject = injectParams;

    angular.module('myApp').controller('FeedController', FeedController);

}());
