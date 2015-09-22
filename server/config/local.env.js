'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:9000',
  SESSION_SECRET: "caregiverscom-secret",
  // Control debug level for modules using visionmedia/debug
  DEBUG: '',
  STORMPATH_API_KEY_ID: '5KAY5PQY4E8RPN3CXRG2MGVKQ',
  STORMPATH_API_KEY_SECRET: 'ZLxTViQ5blKJp27fcZ416IQWcVbzExDbfiv+4Nx68QM',
  STORMPATH_APP_HREF: 'https://api.stormpath.com/v1/applications/1Ii5SIcQs9aNG9HmF7jpvJ'
};
