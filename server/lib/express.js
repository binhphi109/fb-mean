'use strict';

/**
 * Module dependencies.
 */
var config = require('../lib/config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    flash = require('connect-flash'),
    path = require('path');

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    // Should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Disable views cache
    app.set('view cache', false);

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    app.use(flash());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
    // Set views path and view engine
    app.set('view engine', 'jade');
    app.set('views', path.resolve('./server/views'));
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: false,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        }
    }));
};

/**
 * Configure Authentication configuration
 */
module.exports.initAuthentication = function (app) {
    // Use Passport to authenticate
    var passport = require('../lib/passport');
    passport(app);
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
    // Use helmet to secure Express headers
    var SIX_MONTHS = 15778476000;
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
    app.use(helmet.noSniff());
    app.use(helmet.ieNoOpen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
};

/**
 * Configure the modules server routes
 */
module.exports.initRoutes = function (app) {
    // Setting the app router and static folder
    app.use(express.static(path.resolve('./client')));

    // Globbing routing files
    config.files.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
    // Initialize express app
    var app = express();

    // Initialize Express middleware
    this.initMiddleware(app);

    // Initialize Express view engine
    this.initViewEngine(app);

    // Initialize Express session
    this.initSession(app, db);

    // Initialize Authentication
    this.initAuthentication(app);

    // Initialize Helmet security headers
    this.initHelmetHeaders(app);

    // Initialize routes
    this.initRoutes(app);

    return app;
};
