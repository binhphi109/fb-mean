'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    path = require('path'),
    errorHandler = require('./errorsController'),
    mongoose = require('mongoose'),
    multer = require('multer'),
    config = require('../lib/config'),
    User = mongoose.model('User');

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
    var user = req.user;
    var message = null;
    var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
    var profileUploadFileFilter = require('../lib/multer').profileUploadFileFilter;
  
    // Filtering to upload only images
    upload.fileFilter = profileUploadFileFilter;

    if (user) {
        upload(req, res, function (uploadError) {
            if(uploadError) {
                return res.status(400).send({
                    message: 'Error occurred while uploading profile picture'
                });
            } else {
                user.profileImageURL = config.uploads.profileUpload.url + req.file.filename;

                user.save(function (saveError) {
                    if (saveError) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(saveError)
                        });
                    } else {
                        req.login(user, function (err) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(400).send({
            message: 'User is not signed in'
        });
    }
};

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