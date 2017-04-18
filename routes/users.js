var express = require('express');
var passport = require('passport');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;

var funct = require('../scripts/passport.js');
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

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

module.exports = router;
