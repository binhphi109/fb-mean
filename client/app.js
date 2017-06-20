(function () {

    var app = angular.module('myApp',
        ['ui.router', 'ui.bootstrap']);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var viewBase = '/views/';

        $stateProvider
            .state('main', {
                //abstract: true,
                controller: 'MainController',
                templateUrl: viewBase + 'main.html'
            })
            .state('main.home', {
                url: '/',
                controller: 'FeedController',
                templateUrl: viewBase + 'feed.html'
            })
            .state('main.profile', {
                url: '/profile/:username',
                controller: 'ProfileController',
                templateUrl: viewBase + 'profile.html'
            })
            .state('register', {
                url: '/register',
                controller: 'LoginController',
                templateUrl: viewBase + 'register.html'
            })
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: viewBase + 'login.html'
            });

        $urlRouterProvider.otherwise('/');

    }]);

    app.run(['$rootScope', '$state', 'authService',
        function ($rootScope, $state, authService) {
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if(toState.name === 'login') {
                    storePreviousState(fromState, fromParams);
                }

                if (toState && toState.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            $state.go('login').then(function () {
                                storePreviousState(toState, toParams);
                            });
                        });
                    }
                }
            });

            // Store previous state
            function storePreviousState(state, params) {
                // only store this state if it shouldn't be ignored 
                if (!state.data || !state.data.ignoreState) {
                    $state.previous = {
                        state: state,
                        params: params,
                        href: $state.href(state, params)
                    };
                }
            }
        }]);

}());

