'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    _ = require('lodash');

/**
 * Render main page.
 */
exports.index = function(req, res){
    res.render('index');
};
