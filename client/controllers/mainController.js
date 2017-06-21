(function () {

    var injectParams = ['$scope', '$state', 'Authentication', 'authService'];

    var MainController = function ($scope, $state, Authentication, authService) {

        $scope.appTitle = 'Facebook Lite';
        $scope.currentUser = Authentication.user;

        $scope.logout = function () {
            if (Authentication.user) { 
                authService.signout().then(function (results) {
                    $state.go('login');
                    return;
                });                
            }
        };
    };

    MainController.$inject = injectParams;

    angular.module('myApp').controller('MainController', MainController);

}());
