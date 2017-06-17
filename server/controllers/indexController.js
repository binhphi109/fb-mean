'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    _ = require('lodash');

/**
 * GET home page.
 */
exports.index = function(req, res){
    res.render('index');
};
