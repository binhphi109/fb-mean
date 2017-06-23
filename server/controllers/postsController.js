'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    errorHandler = require('./errorsController'),
    _ = require('lodash');

/**
 * Create a Post
 */
exports.create = function(req, res) {
    var post = new Post(req.body);
    post.user = req.user;

    post.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(post);
        }
    });
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var post = req.post ? req.post.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    //post.isCurrentUserOwner = req.user && post.user && post.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(post);
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
    var post = req.post;

    post = _.extend(post, req.body);

    post.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            post.populate({
                path: 'comments',
                populate: { path: 'user', select: 'displayName profileImageURL' }
            }, function (err, post){
                res.jsonp(post);
            });
        }
    });
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
    var post = req.post,
        comments = post.comments,
        i = comments.length;

    post.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if(i == 0){
                res.jsonp({ status: true });
            } else {
            // async full parallel for deleting
                while(i--){
                    var comment = comments[i];
                    comment.remove(function(err) {
                        if(err){
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            comments.pop();
                            if(comments.length === 0) {
                                res.jsonp({ status: true });
                            }
                        }
                    });
                }
            }
        }
    });
};

/**
 * List of Posts
 */
exports.list = function(req, res) { 
    var postAt = req.query.postAt,
        query = postAt ? { 'postAt': postAt } : {};

    Post.find(query).sort('-created')
        .populate('postAt', 'displayName username profileImageURL')
        .populate('user', 'displayName username profileImageURL')
        .populate('likes', 'displayName')
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'displayName username profileImageURL' }
        })
        .exec(function(err, posts) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(posts);
            }
        });
};

/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Post is invalid'
        });
    }

    Post.findById(id)
        .populate('postAt', 'displayName username profileImageURL')
        .populate('user', 'displayName username profileImageURL')
        .populate('likes', 'displayName')
        .populate({
            path: 'comments',
            populate: { path: 'user', select: 'displayName username profileImageURL' }
        })
        .exec(function (err, post) {
            if (err) {
                return next(err);
            } else if (!post) {
                return res.status(404).send({
                    message: 'No Post with that identifier has been found'
                });
            }
            req.post = post;
            next();
        });
};
