'use strict';

(function () {

    var injectParams = ['$timeout'];

    var focusOn = function($timeout) {
        return function(scope, element, attrs) {
            scope.$on(attrs.focusOn, function(e) {
                $timeout(function() {
                    element[0].focus(); 
                });
            });
        };
    };

    focusOn.$inject = injectParams;

    angular.module('myApp').directive('focusOn', focusOn);

}());