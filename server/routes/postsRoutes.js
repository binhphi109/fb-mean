'use strict';

/**
 * Module dependencies.
 */
var baseUrl = '/api/v1/',
    policy = require('../policies/postsPolicy'),
    api = require('../controllers/postsController');

module.exports = function (app) {
    // Post Routes
    app.route(baseUrl + 'Posts').all(policy.isAllowed)
        .get(api.list)
        .post(api.create);

    app.route(baseUrl + 'Posts/:postId').all(policy.isAllowed)
        .get(api.read)
        .put(api.update)
        .delete(api.delete);

    // Finish by binding the Blog middleware
    app.param('postId', api.postByID);
};
