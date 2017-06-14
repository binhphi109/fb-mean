(function () {

    var injectParams = ['$scope', '$state', '$stateParams', 'authService'];

    var LoginController = function ($scope, $state, $stateParams, authService) {
        var path = '/';

        $scope.email = null;
        $scope.password = null;
        $scope.errorMessage = null;

        $scope.login = function () {
            authService.login($scope.email, $scope.password).then(function (status) {
                //$stateParams.redirect will have the route
                //they were trying to go to initially
                if (!status) {
                    $scope.errorMessage = 'Unable to login';
                    return;
                }

                // And redirect to the previous or home page
                $state.go($state.previous.state.name || 'home', $state.previous.params);
            });
        };
    };

    LoginController.$inject = injectParams;

    angular.module('myApp')
        .controller('LoginController', LoginController);

}());