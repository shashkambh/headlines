var express = require('express');
var passport = require('passport');
var router = express.Router();
var rssTest = require('../scripts/rss.js')
// ============= USER ROUTES ==============

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

router.get('/login', function(req, res){
	res.render('signup.ejs', { title: "Login", error: res.locals.loginerror });
});

router.post('/login', passport.authenticate('local-signin', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/signup', function(req, res){
	res.render('signup.ejs', { title: "Signup", error: res.locals.signuperror });
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  req.logout();
  //res.locals.notice = "You have successfully been logged out " + name + "!";
  res.redirect('/');
});

router.get('/preferences', function(req, res, next) {
	res.render('preferences', {title: "Settings"});
}); 

module.exports = router;
