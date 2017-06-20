'use strict';

/**
 * Module dependencies.
 */
var baseUrl = '/api/v1/',
    api = require('../controllers/commentsController');

module.exports = function (app) {
    // Comment Routes
    app.route(baseUrl + 'Comments')
        .get(api.list)
        .post(api.create);
        
    app.route(baseUrl + 'Comments/:commentId')
        .get(api.read)
        .put(api.update)
        .delete(api.delete);

    // Finish by binding the Blog middleware
    app.param('commentId', api.commentByID);
};
