'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Register
 */
exports.register = function (req, res) {
    var user = new User(req.body);

    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};

/**
 * Login after passport authentication
 */
exports.login = function (req, res, next) {
    var userName = req.body.userName;
    var password = req.body.password;

    //Simulate login
    res.json({ status: true });
};

/**
 * Logout
 */
exports.logout = function (req, res) {
    res.json({ status: true });
    res.redirect('/');
};
