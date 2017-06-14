(function () {

    var injectParams = ['$scope', '$location', '$state', 'config', 'authService'];

    var NavbarController = function ($scope, $location, $state, config, authService) {
        var appTitle = 'Discount Management';

        $scope.isCollapsed = false;
        $scope.appTitle = appTitle;

        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) === path;
        };

        $scope.loginOrOut = function () {
            setLoginLogoutText();
            var isAuthenticated = authService.user.isAuthenticated;
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
            $scope.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
        }

        setLoginLogoutText();

    };

    NavbarController.$inject = injectParams;

    angular.module('myApp').controller('NavbarController', NavbarController);

}());
