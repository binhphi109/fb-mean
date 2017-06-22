'use strict';

/**
 * Module dependencies.
 */
var baseUrl = '/api/v1/',
    users = require('../controllers/usersController');

module.exports = function (app) {
    // Post Routes
    app.route(baseUrl + 'profile/:username').get(users.read);
    app.route(baseUrl + 'users/:userId').get(users.read);
    app.route(baseUrl + 'users/picture').post(users.changeProfilePicture);


    // Finish by binding the User middleware
    app.param('userId', users.userByID);
    app.param('username', users.userByName);
};
