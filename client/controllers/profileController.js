(function () {

    var injectParams = ['$scope', '$stateParams', '$filter', '$window', '$timeout', 
        'authService', 'usersService', 'postsService', 'commentsService', 'modalService'];

    var ProfileController = function ($scope, $stateParams, $filter, $window, $timeout, 
        authService, usersService, postsService, commentsService, modalService) {

        var currentUser = authService.currentUser;

        $scope.posts = [];
        $scope.profileUser = {};

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
                content: self.commentContent
            };

            // update to db
            commentsService.insertComment(newComment).then(function(data) {
                post.comments.push(data);
                self.commentContent = '';
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        $scope.addPost = function() {
            var self = this;
            var newPost = {
                content: self.postContent,
                postAt: 'profile/' + $scope.profileUser.username
            };

            // update to db
            postsService.insertPost(newPost).then(function(data) {
                $scope.posts.unshift(data);
                self.postContent = '';
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
            // get profile user info
            usersService.getUserByUsername($stateParams.username).then(function (data) {
                _.extend($scope.profileUser, data);
            }, function (error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
            // get posts by user
            postsService.getPosts($stateParams.username).then(function (data) {
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

    ProfileController.$inject = injectParams;

    angular.module('myApp').controller('ProfileController', ProfileController);

}());
