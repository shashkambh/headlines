var express = require('express');
var passport = require('passport');
var router = express.Router();

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}

router.get('/login', function(req, res){
	res.render('login.ejs', { message: req.flash('loginMessage') });
});
router.post('/login', passport.authenticate('local-login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));

router.get('/signup', function(req, res){
	res.render('signup.ejs', { message: req.flash('signupMessage') });
});


router.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/',
	failureRedirect: '/signup',
	failureFlash: true
}));

router.get('/profile', isLoggedIn, function(req, res){
	res.render('profile.ejs', { user: req.user });
});

router.get('/login/facebook', passport.authenticate('facebook', {scope: ['email', 'id']}));

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

	   );
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

module.exports = router;
