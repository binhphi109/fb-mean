(function () {

    var injectParams = ['$http', '$rootScope'];

    var authFactory = function ($http, $rootScope) {
        var serviceBase = '/api/v1/',
            factory = {
                currentUser: {},
                isAuthenticated: false,
                roles: null
            };

        factory.signup = function (user) {
            return $http.post(serviceBase + 'signup', user).then(function (results) {
                factory.currentUser = results.data;
                factory.isAuthenticated = true;
                return true;
            });
        };

        factory.signin = function (username, password) {
            return $http.post(serviceBase + 'signin', { username: username, password: password })
                .then(function (results) {
                    factory.currentUser = results.data;
                    factory.isAuthenticated = true;
                    return true;
                });
        };

        factory.signout = function () {
            return $http.post(serviceBase + 'signout')
                .then(function (results) {
                    factory.currentUser = {};
                    factory.isAuthenticated = false;
                    return false;
                });
        };

        return factory;
    };

    authFactory.$inject = injectParams;

    angular.module('myApp').factory('authService', authFactory);

}());

