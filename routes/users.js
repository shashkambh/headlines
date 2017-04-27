var express = require('express');
var passport = require('passport');
var router = express.Router();
var rssTest = require('../scripts/rss.js')
var bodyParser = require('body-parser');
var database = require('../scripts/database.js')

// ============= USER ROUTES ==============

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

router.get('/login', function(req, res){
	res.render('signup.ejs', { title: "Login", error: req.session.loginerror });
});

router.post('/login', passport.authenticate('local-signin', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/signup', function(req, res){
	res.render('signup.ejs', { title: "Signup", error: req.session.signuperror });
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
  req.session.notice = "You have successfully been logged out " + name + "!";
  res.redirect('/');
});

router.get('/preferences', function(req, res, next) {
	res.render('preferences', {title: "Settings", user: req.user});
}); 


router.post('/preferences', function(req, res){
    database.addUserFeed(req, res, req.user, req.body.news);
    res.redirect('/');
});  

module.exports = router;
