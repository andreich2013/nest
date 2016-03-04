/**
 *  Copyright 2014 Nest Labs Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';

var grunt = require('grunt'),
    express = require('express'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    root = process.cwd(),
    app = express(),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    NestStrategy = require('passport-nest').Strategy,
    config = grunt.file.readJSON(root + '/config/dev.json');


/**
  Setup Passport to use the NestStrategy,
  simply pass in the clientID and clientSecret.

  Here we are pulling those in from ENV variables.
*/


passport.use(new NestStrategy({
    clientID: config.NEST_ID,
    clientSecret: config.NEST_SECRET
  }
));

/**
  No user data is available in the Nest OAuth
  service, just return the empty user object.
*/
passport.serializeUser(function(user, done) {
  done(null, user);
});

/**
  No user data is available in the Nest OAuth
  service, just return the empty user object.
*/
passport.deserializeUser(function(user, done) {
  done(null, user);
});

/**
  Setup the Express app
*/
app.use(cookieParser('cookie_secret_shh')); // Change for production apps
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'session_secret_shh', // Change for production apps
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(root + '/project/app'));
app.use('/bower_components',  express.static(root + '/project/bower_components'));
app.use('/assets',  express.static(root + '/project/assets'));

/**
  Listen for calls and redirect the user to the Nest OAuth
  URL with the correct parameters.
*/
app.get('/auth/nest', passport.authenticate('nest'));

/**
  Upon return from the Nest OAuth endpoint, grab the user's
  accessToken and set a cookie so jQuery can access, then
  return the user back to the root app.
*/
app.get('/auth/nest/callback',
    passport.authenticate('nest', { }),
    function(req, res) {
        res.cookie('nest_token', req.user.accessToken);
        res.redirect('/');
    }
);

app.get('/thermostat', function(req, res) {
    res.redirect('/');
});

/**
  Export the app
*/
module.exports = app;
