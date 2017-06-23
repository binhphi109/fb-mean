'use strict';

/**
 * Module dependencies.
 */
var baseUrl = '/api/v1/',
    policy = require('../policies/commentsPolicy'),
    api = require('../controllers/commentsController');

module.exports = function (app) {
    // Comment Routes
    app.route(baseUrl + 'Comments').all(policy.isAllowed)
        .get(api.list)
        .post(api.create);
        
    app.route(baseUrl + 'Comments/:commentId').all(policy.isAllowed)
        .get(api.read)
        .put(api.update)
        .delete(api.delete);

    // Finish by binding the Blog middleware
    app.param('commentId', api.commentByID);
};
