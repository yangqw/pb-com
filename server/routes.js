/**
 * Main application routes
 */

'use strict';

var spExpressSdk = require('stormpath-sdk-express');

var errors = require('./components/errors');
var path = require('path');

var localEnv = require('./config/local.env');
var spConfig = {
  appHref: localEnv.STORMPATH_APP_HREF,
  apiKeyId: localEnv.STORMPATH_API_KEY_ID,
  apiKeySecret: localEnv.STORMPATH_API_KEY_SECRET,
  // http://stackoverflow.com/questions/25870199/angularjs-cross-origin-request-blockeId
  allowedOrigins: ['http://localhost:9333']
};
var spMiddleware = spExpressSdk.createMiddleware(spConfig);
module.exports = function(app) {
  // Attach route handlers to Express
  spMiddleware.attachDefaults(app);

  // Insert routes below
  // Secure the stormpath things endpoint
  app.use('/api/things', spMiddleware.authenticate, require('./api/thing'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
