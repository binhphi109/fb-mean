(function () {

    var injectParams = ['$http', '$rootScope'];

    var authFactory = function ($http, $rootScope) {
        var serviceBase = '/api/v1/',
            factory = {
                currentUser: {
                    username: 'kugoo109',
                    email: 'kugoo109@gmail.com',
                    displayName: 'Binh-Phi Nguyen',
                },
                isAuthenticated: false,
                roles: null
            };

        factory.login = function (email, password) {
            return $http.post(serviceBase + 'login', { userName: email, password: password }).then(
                function (results) {
                    var loggedIn = results.data.status;;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.logout = function () {
            return $http.post(serviceBase + 'logout').then(
                function (results) {
                    var loggedIn = !results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        function changeAuth(loggedIn) {
            factory.isAuthenticated = loggedIn;
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    angular.module('myApp').factory('authService', authFactory);

}());

