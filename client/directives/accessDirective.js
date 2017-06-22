'use strict';

define(['app'], function (app) {

    var injectParams = ['$rootScope', 'authService'];

    var accessDirective = function ($rootScope, authService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var makeVisible = function () {
                        element.removeClass('hidden');
                    },
                    makeHidden = function () {
                        element.addClass('hidden');
                    },
                    determineVisibility = function (resetFirst) {
                        var result;
                        if (resetFirst) {
                            makeVisible();
                        }

                        result = authService.authorize(roles);
                        if (result) {
                            makeVisible();
                        } else {
                            makeHidden();
                        }
                    },
                    roles = attrs.access.split(',');


                $rootScope.$on('loginStatusChanged', function () {
                    determineVisibility();
                });


                if (roles.length > 0) {
                    determineVisibility(true);
                }
            }
        };
    };

    accessDirective.$inject = injectParams;

    app.directive('access', accessDirective);

});