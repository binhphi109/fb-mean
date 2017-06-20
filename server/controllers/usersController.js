'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Create a User
 */
exports.create = function(req, res) {
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
 * Show the current User
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var user = req.user ? req.user.toJSON() : {};

    res.jsonp(user);
};

/**
 * User middleware
 */
exports.userByUsername = function(req, res, next, username) {

    if (!username) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    User.findOne({ 'username': username })
        .exec(function (err, user) {
            if (err) {
                return next(err);
            } else if (!user) {
                return res.status(404).send({
                    message: 'No User with that name has been found'
                });
            }
            req.user = user;
            next();
        });
};