'use strict';

(function () {

    var injectParams = ['$scope', 'Authentication', 'Socket', 'Common', 'postsService', 'commentsService'];

    var FeedController = function ($scope, Authentication, Socket, Common, postsService, commentsService) {

        $scope.currentUser = Authentication.user;
        $scope.posts = [];

        $scope.hitLike = function (post) {
            if(post.isLiked) {
                // unlike
                post.isLiked = false;
                _.remove(post.likes, function(user) {
                    return user._id === $scope.currentUser._id;
                });
            } else {
                // like
                post.isLiked = true;
                post.likes.push($scope.currentUser);
            }
            
            // update to db
            postsService.updatePost(post).then(function(data) {
                // reload post
                _.extend(post, data);
                post.isLiked = Common.isLiked(post.likes, $scope.currentUser);
            });
        };

        $scope.hitComment = function () {
            this.isCommentFocused = true;
        };

        $scope.addComment = function (post) {
            var self = this;
            var newComment = {
                post: post._id,
                content: self.commentContent
            };

            // update to db
            commentsService.insertComment(newComment).then(function(data) {
                // Emit a 'newComment' message event
                Socket.emit('newComment', data);
                // reset comment field
                self.commentContent = '';
            });
        };

        // Add an event listener to the 'chatMessage' event
        Socket.on('newComment', function (data) {
            var post = _.find($scope.posts, function(item) { 
                return item._id === data._id; 
            });
            angular.extend(post, data);
        });

        $scope.addPost = function() {
            var self = this;
            var newPost = {
                content: self.postContent,
                postAt: $scope.currentUser._id
            };

            // update to db
            postsService.insertPost(newPost).then(function(data) {
                $scope.posts.unshift(data);
                self.postContent = '';
            });
        };

        $scope.deletePost = function(post) {
            postsService.deletePost(post._id).then(function(data) {
                // remove post from feed
                _.remove($scope.posts, post);
            });
        };

        $scope.deleteComment = function(post, comment) {
            commentsService.deleteComment(comment._id).then(function(data) {
                // reload post
                _.extend(post, data);
                post.isLiked = Common.isLiked(post.likes, $scope.currentUser);
            });
        };

        // Remove the event listener when the controller instance is destroyed
        $scope.$on('$destroy', function () {
            Socket.removeListener('newComment');
        });

        function init() {
            // fetch data from service
            postsService.getPosts().then(function (data) {
                $scope.posts = data;
                // check like of currentUser for each post
                $scope.posts.forEach(function(post){
                    post.isLiked = Common.isLiked(post.likes, $scope.currentUser);
                });
            });
        }

        init();
    };

    FeedController.$inject = injectParams;

    angular.module('myApp').controller('FeedController', FeedController);

}());
