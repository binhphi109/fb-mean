'use strict';

(function () {

    var injectParams = [];

    var ngEnter = function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
 
                    event.preventDefault();
                }
            });
        };
    };

    ngEnter.$inject = injectParams;

    angular.module('myApp').directive('ngEnter', ngEnter);

}());