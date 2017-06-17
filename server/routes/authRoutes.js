'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
    // User Routes
    var auth = require('../controllers/authController');

    // Setting up the users authentication api
    app.route('/api/register').post(auth.register);
    app.route('/api/login').post(auth.login);
    app.route('/api/logout').get(auth.logout);

};
