'use strict';

(function () {

    var injectParams = ['$timeout', '$parse'];

    var isFocused = function($timeout, $parse) {
        return {
            // optionally create a child scope
            //scope: true,   
            link: function(scope, element, attrs) {
                var model = $parse(attrs.isFocused);
                scope.$watch(model, function(value) {
                    if(value === true) { 
                        $timeout(function() {
                            element[0].focus(); 
                        });
                    }
                });
                // on blur event:
                element.bind('blur', function() {
                    scope.$apply(model.assign(scope, false));
                });
            }
        };
    };

    isFocused.$inject = injectParams;

    angular.module('myApp').directive('isFocused', isFocused);

}());