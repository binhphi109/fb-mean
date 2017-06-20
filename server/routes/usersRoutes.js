'use strict';

/**
 * Module dependencies.
 */
var baseUrl = '/api/v1/',
    api = require('../controllers/usersController');

module.exports = function (app) {
    // Post Routes
    app.route(baseUrl + 'Users')
        .post(api.create);

    app.route(baseUrl + 'Users/:username')
        .get(api.read);

    // Finish by binding the Blog middleware
    app.param('username', api.userByUsername);
};
