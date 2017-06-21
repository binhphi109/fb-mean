(function () {

    var injectParams = ['$scope', 'Authentication', 'postsService', 'commentsService'];

    var FeedController = function ($scope, Authentication, postsService, commentsService) {

        var currentUser = Authentication.user;

        $scope.posts = [];

        $scope.hitLike = function (post) {
            if(post.isLiked) {
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
                post.comments.push(data);
                self.commentContent = '';
            });
        };

        $scope.addPost = function() {
            var self = this;
            var newPost = {
                content: self.postContent,
                postAt: 'profile/' + currentUser.username
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
                post.isLiked = isLiked(post.likes, currentUser);
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
