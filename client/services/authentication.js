'use strict';

(function () {
    // Authentication service for user variables
    var injectParams = ['$window'];

    var Authentication = function ($window) {
        var auth = {
            user: $window.user
        };

        return auth;
    };

    Authentication.$inject = injectParams;

    angular.module('myApp').factory('Authentication', Authentication);

}());