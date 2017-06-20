'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
    // User Routes
    var baseUrl = '/api/v1/',
        auth = require('../controllers/authController');

    // Setting up the users authentication api
    app.route(baseUrl + 'login').post(auth.login);
    app.route(baseUrl + 'logout').get(auth.logout);

};
