'use strict';

/**
 * Module dependencies.
 */
var controller = require('../controllers/indexController');

module.exports = function (app) {
    // Routes
    app.route('/').get(controller.index);

    // redirect all others to the index (HTML5 history)
    app.route('*').get(controller.index);
};
