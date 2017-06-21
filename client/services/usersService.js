(function () {

    var injectParams = ['$http', '$q', 'config'];

    var usersFactory = function ($http, $q, config) {
        var serviceBase = '/api/v1/',
            factory = {};

        factory.getProfile = function (username) {
            return $http.get(serviceBase + 'profile/' + username).then(function (results) {
                return results.data;
            });
        };

        return factory;
    };

    usersFactory.$inject = injectParams;

    angular.module('myApp').factory('usersService', usersFactory);

}());