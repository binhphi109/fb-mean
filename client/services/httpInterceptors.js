'use strict';

(function () {

    angular.module('myApp')
        .config(['$httpProvider', function ($httpProvider) {

            var injectParams = ['$q', '$rootScope', 'Authentication'];

            var httpInterceptor401 = function ($q, $rootScope, Authentication) {

                var success = function (response) {
                    return response;
                };

                var error = function (res) {
                    if (res.status === 401) {
                        // Deauthenticate the global user
                        Authentication.user = null;

                        $injector.get('$state').transitionTo('login');
                        return $q.reject(res);
                    }
                    return $q.reject(res);
                };

                return function (promise) {
                    return promise.then(success, error);
                };

            };

            httpInterceptor401.$inject = injectParams;

            $httpProvider.interceptors.push(httpInterceptor401);

        }]);

}());