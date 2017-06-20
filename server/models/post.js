'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
    content: {
        type: String,
        default: '',
        required: 'Please fill Post content',
    },
    likes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    postAt: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Post', PostSchema);
