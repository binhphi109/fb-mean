(function () {

    var injectParams = ['$scope', '$filter', '$window', '$timeout', 
        'authService', 'postsService', 'commentsService', 'modalService'];

    var FeedController = function ($scope, $filter, $window, $timeout, 
        authService, postsService, commentsService, modalService) {

        var currentUser = authService.currentUser;

        $scope.posts = [];

        $scope.hitLike = function (post) {
            if(isLiked(post.likes, currentUser)) {
                // unlike
                post.isLiked = false;
                _.remove(post.likes, function(user) {
                    return user._id === currentUser._id;
                });
            } else {
                // like
                post.isLiked = true;
                post.likes.push(currentUser);
            }
            
            // update to db
            postsService.updatePost(post).then(function(data) {
                // reload post
                _.extend(post, data);
                post.isLiked = isLiked(post.likes, currentUser);
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        $scope.hitComment = function () {
            this.isCommentFocused = true;
        };

        $scope.addComment = function (post) {
            var self = this;
            var newComment = {
                post: post._id,
                content: self.commentText
            };

            // update to db
            commentsService.insertComment(newComment).then(function(data) {
                post.comments.push(data);
                self.commentText = '';
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        $scope.deletePost = function(post) {
            postsService.deletePost(post._id).then(function(data) {
                // remove post from feed
                _.remove($scope.posts, post);
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        $scope.deleteComment = function(post, comment) {
            commentsService.deleteComment(comment._id).then(function(data) {
                // reload post
                _.extend(post, data);
                post.isLiked = isLiked(post.likes, currentUser);
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        function init() {
            // fetch data from service
            postsService.getPosts().then(function (data) {
                $scope.posts = data;
                // check like of currentUser for each post
                $scope.posts.forEach(function(post){
                    post.isLiked = isLiked(post.likes, currentUser);
                });
            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        }

        function isLiked(likes, currentUser) {
            var index = _.findIndex(likes, function(user){
                return user._id === currentUser._id;
            });
            if(index < 0){
                return false;
            } else {
                return true;
            }
        }

        init();
    };

    FeedController.$inject = injectParams;

    angular.module('myApp').controller('FeedController', FeedController);

}());
