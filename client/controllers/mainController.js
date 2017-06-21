(function () {

    var injectParams = ['$scope', '$location', '$state', '$window', 'config', 'Authentication', 'authService'];

    var MainController = function ($scope, $location, $state, $window, config, Authentication, authService) {

        $scope.appTitle = 'Facebook Lite';
        $scope.currentUser = Authentication.user;

        $scope.logout = function () {
            if (Authentication.user) { 
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
