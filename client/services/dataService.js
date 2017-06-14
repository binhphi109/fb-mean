(function () {

    var injectParams = ['$http', '$q', 'config'];

    var discountsFactory = function ($http, $q, config) {
        var serviceBase = '/api/v1/',
            factory = {};

        

        return factory;
    };

    discountsFactory.$inject = injectParams;

    angular.module('myApp').factory('dataService', discountsFactory);

}());