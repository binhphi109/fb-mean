(function () {

    var injectParams = ['$http', '$q', 'config'];

    var usersFactory = function ($http, $q, config) {
        var serviceBase = '/api/v1/',
            factory = {};

        factory.insertUser = function (user) {
            return $http.post(serviceBase + 'users', user).then(function (results) {
                user.id = results.data.id;
                return results.data;
            });
        };

        factory.getUserByUsername = function (username) {
            return $http.get(serviceBase + 'users/' + username).then(function (results) {
                return results.data;
            });
        };

        return factory;
    };

    usersFactory.$inject = injectParams;

    angular.module('myApp').factory('usersService', usersFactory);

}());