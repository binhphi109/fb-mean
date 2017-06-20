(function () {

    var injectParams = ['$http', '$q', 'config'];

    var commentsFactory = function ($http, $q, config) {
        var serviceBase = '/api/v1/',
            factory = {};

        factory.getComments = function () {
            return $http.get(serviceBase + 'comments').then(function (results) {
                return results.data;
            });
        };

        factory.insertComment = function (comment) {
            return $http.post(serviceBase + 'comments', comment).then(function (results) {
                comment.id = results.data.id;
                return results.data;
            });
        };

        factory.newComment = function () {
            return $q.when({ id: 0 });
        };

        factory.updateComment = function (comment) {
            return $http.put(serviceBase + 'comments/' + comment.id, comment).then(function (status) {
                return status.data;
            });
        };

        factory.deleteComment = function (id) {
            return $http.delete(serviceBase + 'comments/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getCommentById = function (id) {
            return $http.get(serviceBase + 'comments/' + id).then(function (results) {
                return results.data;
            });
        };

        return factory;
    };

    commentsFactory.$inject = injectParams;

    angular.module('myApp').factory('commentsService', commentsFactory);

}());