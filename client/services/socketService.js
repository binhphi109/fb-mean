'use strict';

(function () {

    var injectParams = ['Authentication', '$state', '$timeout'];

    var Socket = function (Authentication, $state, $timeout) {
        var service = {};

        // Connect to Socket.io server
        service.connect = function () {
            // Connect only when authenticated
            if (Authentication.user) {
                service.socket = io();
            }
        };
        service.connect();

        // Wrap the Socket.io 'on' method
        service.on = function (eventName, callback) {
            if (service.socket) {
                service.socket.on(eventName, function (data) {
                    $timeout(function () {
                        callback(data);
                    });
                });
            }
        };

        // Wrap the Socket.io 'emit' method
        service.emit = function (eventName, data) {
            if (service.socket) {
                service.socket.emit(eventName, data);
            }
        };

        // Wrap the Socket.io 'removeListener' method
        service.removeListener = function (eventName) {
            if (service.socket) {
                service.socket.removeListener(eventName);
            }
        };

        return service;
    };

    Socket.$inject = injectParams;

    angular.module('myApp').service('Socket', Socket);

}());