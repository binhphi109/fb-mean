(function () {

    var injectParams = ['$http', '$q', 'config'];

    var datasFactory = function ($http, $q, config) {
        var serviceBase = '/api/v1/',
            factory = {};

        

        return factory;
    };

    datasFactory.$inject = injectParams;

    angular.module('myApp').factory('dataService', datasFactory);

}());