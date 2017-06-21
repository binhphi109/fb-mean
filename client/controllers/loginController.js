(function () {

    var injectParams = ['$scope', '$state', '$stateParams', '$window', 'authService'];

    var LoginController = function ($scope, $state, $stateParams, $window, authService) {
        var path = '/';

        $scope.displayName = null;
        $scope.email = null;
        $scope.username = null;
        $scope.password = null;
        $scope.errorMessage = null;

        $scope.login = function () {
            authService.signin($scope.username, $scope.password).then(function (status) {
                //$stateParams.redirect will have the route
                //they were trying to go to initially
                if (!status) {
                    $scope.errorMessage = 'Unable to login';
                    return;
                }
                // And redirect to the previous or home page
                redirectToPrevious($state.previous);
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        $scope.register = function () {
            var user = {
                displayName: $scope.displayName,
                email: $scope.email,
                password: $scope.password
            };

            authService.signup(user).then(function (status) {
                //$stateParams.redirect will have the route
                //they were trying to go to initially
                if (!status) {
                    $scope.errorMessage = 'Unable to register';
                    return;
                }
                // And redirect to the previous or home page
                redirectToPrevious($state.previous);
            }, function(error) {
                $window.alert('Sorry, an error occurred: ' + error.data.message);
            });
        };

        function redirectToPrevious(previous) {
            if(previous){
                $state.go($state.previous.state.name, $state.previous.params);
            } else {
                $state.go('main.home');
            }
        }
    };

    LoginController.$inject = injectParams;

    angular.module('myApp').controller('LoginController', LoginController);

}());