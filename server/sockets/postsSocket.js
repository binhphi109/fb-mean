'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require('../controllers/errorsController'),
    _ = require('lodash');

// Create the chat configuration
module.exports = function (io, socket) {

    // Send a chat messages to all connected sockets when a message is received
    socket.on('newComment', function (data) {
        // Emit the 'chatMessage' event
        io.emit('newComment', data);
    });
};
