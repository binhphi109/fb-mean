(function () {

    var injectParams = ['$http', '$rootScope', '$window', 'Authentication'];

    var authFactory = function ($http, $rootScope, $window, Authentication) {
        var serviceBase = '/api/v1/auth/',
            factory = {};

        factory.checkMe = function () {
            return $http.get(serviceBase + 'checkme').then(function (results) {
                Authentication.user = results.data;
                return Authentication.user;
            });
        };

        factory.signup = function (user) {
            return $http.post(serviceBase + 'signup', user).then(function (results) {
                Authentication.user = results.data;
                return true;
            });
        };

        factory.signin = function (username, password) {
            return $http.post(serviceBase + 'signin', { username: username, password: password })
                .then(function (results) {
                    Authentication.user = results.data;
                    return true;
                });
        };

        factory.signout = function () {
            return $http.post(serviceBase + 'signout').then(function (results) {
                Authentication.user = {};
                return false;
            });
        };

        return factory;
    };

    authFactory.$inject = injectParams;

    angular.module('myApp').factory('authService', authFactory);

}());

