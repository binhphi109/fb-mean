'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Show the Profile of User
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var user = req.profile ? req.profile.toJSON() : {};
    res.jsonp(user);
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    User.findById(id).exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return res.status(404).send({
                message: 'No User with that name has been found'
            });
        }
        // Remove sensitive data
        user.password = undefined;
        user.salt = undefined;

        req.profile = user;
        next();
    });
};

exports.userByName = function(req, res, next, username) {
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
            // Remove sensitive data
            user.password = undefined;
            user.salt = undefined;

            req.profile = user;
            next();
        });
};