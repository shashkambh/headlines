var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require("./database.js");
var path = require('path');

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var strategyParams = {usernameField: 'username', passwordField: 'password', passReqToCallback: true};

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(strategyParams, db.addUser));

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(strategyParams, db.userLogin));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/signin');
}

