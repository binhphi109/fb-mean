'use strict';

(function () {

    var injectParams = ['$scope', '$stateParams', 'Authentication', 'Common', 'usersService', 
        'modalService', 'postsService', 'commentsService'];

    var ProfileController = function ($scope, $stateParams, Authentication, Common, usersService, 
        modalService, postsService, commentsService) {

        $scope.posts = [];
        $scope.currentUser = Authentication.user;
        $scope.profileUser = {};
        $scope.isEditAllowed = false;

        $scope.showFileUpload = function() {
            modalService.showModalWithTemplate('FileUpload', 'fileUpload/', {
                url: 'api/v1/users/picture',
                alias: 'newProfilePicture',
                header: 'Update Profile Picture',
                action: 'Upload Photo'
            }).then(function (results) {
                if (results) {
                    // Populate user object
                    angular.extend(Authentication.user, results.response);
                    // reload data
                    init();
                }
            });
        }

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
                post.comments.push(data);
                self.commentContent = '';
            });
        };

        $scope.addPost = function() {
            var self = this;
            var newPost = {
                content: self.postContent,
                postAt: $scope.profileUser._id
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

        function init() {
            // get profile user info
            usersService.getProfile($stateParams.username).then(function (data) {
                _.extend($scope.profileUser, data);
                // check edit permission
                $scope.isEditAllowed = $scope.profileUser._id === $scope.currentUser._id;
                // get posts by user
                postsService.getPosts(data._id).then(function (data) {
                    $scope.posts = data;
                    // check like of currentUser for each post
                    $scope.posts.forEach(function(post){
                        post.isLiked = Common.isLiked(post.likes, $scope.currentUser);
                    });
                });
            });
        }

        init();
    };

    ProfileController.$inject = injectParams;

    angular.module('myApp').controller('ProfileController', ProfileController);

}());
