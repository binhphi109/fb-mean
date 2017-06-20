(function () {

    var injectParams = ['$scope', '$location', '$state', 'config', 'authService'];

    var MainController = function ($scope, $location, $state, config, authService) {

        $scope.isCollapsed = false;
        $scope.appTitle = 'Facebook Lite';

        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) === path;
        };

        $scope.loginOrOut = function () {
            setLoginLogoutText();
            var isAuthenticated = authService.isAuthenticated;
            if (isAuthenticated) { //logout 
                authService.logout().then(function () {
                    $state.go('home');
                    return;
                });                
            }
            $state.go('login');
        };

        $scope.$on('loginStatusChanged', function (loggedIn) {
            setLoginLogoutText(loggedIn);
        });

        function setLoginLogoutText() {
            $scope.loginLogoutText = (authService.isAuthenticated) ? 'Logout' : 'Login';
        }

        setLoginLogoutText();

    };

    MainController.$inject = injectParams;

    angular.module('myApp').controller('MainController', MainController);

}());
