/**
 * Main application routes
 */

'use strict';

var spExpressSdk = require('stormpath-sdk-express');

var errors = require('./components/errors');
var path = require('path');

var spMiddleware = spExpressSdk.createMiddleware();
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
