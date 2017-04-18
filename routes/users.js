var express = require('express');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
//var passportFile = require('/Users/allisonjberman/Documents/SoftwareDesign/Headlines_github/headlines/scripts/passport.js');
var funct = require('/Users/allisonjberman/Documents/SoftwareDesign/Headlines_github/headlines/functions.js');

//===============PASSPORT=================
/*
// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  {usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
  	console.log("username!!!", username);
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/signin');
}
*/

// ============= ROUTES ==============

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}

router.get('/login', function(req, res){

	res.render('login.ejs', { message: req.flash('loginMessage') });
});
router.post('/login', passport.authenticate('local-signin', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/signup', function(req, res){
	console.log("get signup");
	res.render('signup.ejs', { message: req.flash('signupMessage') });
	console.log("get signup!!!!");
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
  })
);

/*
router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/signup',
	failureFlash: true
})); */

router.get('/profile', isLoggedIn, function(req, res){
	res.render('profile.ejs', { user: req.user });
});

//===============ROUTES=================

/*
//displays our signup page
router.get('/signup', function(req, res){
  res.render('signup');
}); */



//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});
//===============ROUTES=================

//router.get('/login/facebook', passport.authenticate('facebook', {scope: ['email', 'id']}));

/*
router.get('/login/facebook/return', (req, res, next) => {
	return passport.authenticate('facebook', {
		failureRedirect: '/login',
		session: false
	},
								 (err, user, info) => {
									 if(err) {
										 logger.error(err);
										 res.redirect('/login');
									 }
									 else
									 {
										 next();
									 }
								 })(req, res, next);
}

	   ); */
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

module.exports = router;
