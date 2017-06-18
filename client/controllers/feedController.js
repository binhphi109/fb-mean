(function () {

    var injectParams = ['$scope', '$location', '$filter', '$window',
        '$timeout', 'authService', 'dataService', 'modalService'];

    var FeedController = function ($scope, $location, $filter, $window,
        $timeout, authService, dataService, modalService) {

        $scope.commentText = '';
        $scope.isCommentFocused = false;

        $scope.feeds = [{
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac.',
            isLiked: true,
            likes: [{
                displayName: 'Andrew Williams',
                username: 'awilliams',
            },{
                displayName: 'Binh-Phi Nguyen',
                username: 'kugoo109',
            }],
            comments: [{
                content: 'Lorem ipsum dolor sit amet.',
                user: {
                    displayName: 'Andrew Williams',
                    username: 'awilliams',
                },
                created: new Date()
            }],
            user: {
                displayName: 'Andrew Williams',
                username: 'awilliams',
            },
            created: new Date()
        }];

        $scope.hitLike = function (feed) {
            var currentUser = authService.currentUser;

            var index = _.findIndex(feed.likes, function(user){
                return user.username === currentUser.username;
            });
            if(index < 0) {
                feed.isLiked = true;
                feed.likes.push(currentUser);
            } else {
                feed.isLiked = false;
                _.remove(feed.likes, function(user) {
                    return user.username === currentUser.username;
                });
            }
            
            // update to db

        };

        $scope.hitComment = function (feed) {
            $scope.isCommentFocused = true;
        };

        $scope.addComment = function (feed) {
            var newComment = {
                content: $scope.commentText,
                user: authService.currentUser,
                created: new Date()
            };

            feed.comments.push(newComment);

            // update to db

            $scope.commentText = '';
        };

        function init() {
            // fetch data from service

            // check isLiked of currentUser for each feed

        }

        init();
    };

    FeedController.$inject = injectParams;

    angular.module('myApp').controller('FeedController', FeedController);

}());
