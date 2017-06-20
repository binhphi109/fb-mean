(function () {

    var injectParams = ['$http', '$q', 'config'];

    var postsFactory = function ($http, $q, config) {
        var serviceBase = '/api/v1/',
            factory = {};

        factory.getPosts = function () {
            return $http.get(serviceBase + 'posts').then(function (results) {
                return results.data;
            });
        };

        factory.insertPost = function (post) {
            return $http.post(serviceBase + 'posts', post).then(function (results) {
                post.id = results.data.id;
                return results.data;
            });
        };

        factory.newPost = function () {
            return $q.when({ id: 0 });
        };

        factory.updatePost = function (post) {
            return $http.put(serviceBase + 'posts/' + post._id, post).then(function (status) {
                return status.data;
            });
        };

        factory.deletePost = function (id) {
            return $http.delete(serviceBase + 'posts/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getPostById = function (id) {
            return $http.get(serviceBase + 'posts/' + id).then(function (results) {
                return results.data;
            });
        };

        return factory;
    };

    postsFactory.$inject = injectParams;

    angular.module('myApp').factory('postsService', postsFactory);

}());