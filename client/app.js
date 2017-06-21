(function () {

    var app = angular.module('myApp',
        ['ui.router', 'ui.bootstrap', 'angularMoment']);

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var viewBase = '/views/';

        $stateProvider
            .state('main', {
                //abstract: true,
                controller: 'MainController',
                templateUrl: viewBase + 'main.html',
                secure: true
            })
            .state('main.home', {
                url: '/',
                controller: 'FeedController',
                templateUrl: viewBase + 'feed.html',
                secure: true
            })
            .state('main.profile', {
                url: '/profile/:username',
                controller: 'ProfileController',
                templateUrl: viewBase + 'profile.html',
                secure: true
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

    app.run(['$rootScope', '$state', 'Authentication', 'authService',
        function ($rootScope, $state, Authentication, authService) {
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (toState && toState.secure) {
                    if (!Authentication.user) {
                        event.preventDefault();
                        authService.checkMe().then(function(status) {
                            if(!status){
                                // redirect to login
                                $state.go('login').then(function () {
                                    storePreviousState(toState, toParams);
                                });
                            } else {
                                $state.go(toState, toParams);
                            }
                        }, function(error) {
                            // redirect to login
                            $state.go('login').then(function () {
                                storePreviousState(toState, toParams);
                            });
                        });
                    }
                }
            });

            // // Record previous state
            // $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //     storePreviousState(fromState, fromParams);
            // });

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

