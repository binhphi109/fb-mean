(function () {

    var injectParams = ['$scope', '$location', '$state', '$window', 'config', 'authService'];

    var MainController = function ($scope, $location, $state, $window, config, authService) {

        $scope.appTitle = 'Facebook Lite';
        $scope.currentUser = authService.currentUser;

        $scope.logout = function () {
            var isAuthenticated = authService.isAuthenticated;
            if (isAuthenticated) { 
                authService.signout().then(function (results) {
                    $state.go('login');
                    return;
                }, function(error) {
                    $window.alert('Sorry, an error occurred: ' + error.data.message);
                });                
            }
            $state.go('login');
        };
    };

    MainController.$inject = injectParams;

    angular.module('myApp').controller('MainController', MainController);

}());
