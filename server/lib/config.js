'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path');


/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            file = file.replace(excludes[i], '');
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
   
    // Set config files
    var config = {
        app: {
            title: 'Facebook Lite'
        },
        port: 3000,
        db: {
            uri: 'mongodb://localhost/facebook-lite',
            options: {
                user: '',
                pass: ''
            },
            debug: false
        },
        // Session Cookie settings
        sessionCookie: {
            // session expiration is set by default to 24 hours
            maxAge: 24 * (60 * 60 * 1000),
            // httpOnly flag makes sure the cookie is only accessed
            // through the HTTP protocol and not JS/browser
            httpOnly: true,
            // secure cookie should be turned to true to provide additional
            // layer of security so that the cookie is set only when working
            // in HTTPS mode.
            secure: false
        },
        // sessionSecret should be changed for security measures and concerns
        sessionSecret: 'Fb-Lite'
    };

    config.files = {};
    // Setting Globbed route files
    config.files.routes = getGlobbedPaths(['server/routes/**/!(core)Routes.js', 'server/routes/coreRoutes.js']);
    config.files.models = getGlobbedPaths(['server/models/**/*.js']);

    // Expose configuration utilities
    config.utils = {
        getGlobbedPaths: getGlobbedPaths
    };

    return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
