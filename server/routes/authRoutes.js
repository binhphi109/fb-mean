'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
    // User Routes
    var baseUrl = '/api/v1/auth/',
        auth = require('../controllers/authController');

    // Setting up the users authentication api
    app.route(baseUrl + 'checkme').get(auth.checkme);
    app.route(baseUrl + 'signup').post(auth.signup);
    app.route(baseUrl + 'signin').post(auth.signin);
    app.route(baseUrl + 'signout').post(auth.signout);

};
