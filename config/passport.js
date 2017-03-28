var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


var User            = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.username': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} else {
					var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'local.username': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					}
					return done(null, user);

				});
			});
		}
	));


	passport.use('facebook', new FacebookStrategy({
	    clientID: configAuth.facebookAuth.clientID,
	    clientSecret: configAuth.facebookAuth.clientSecret,
	    callbackURL: configAuth.facebookAuth.callbackURL,
	    //profileFields   : ['id', 'birthday', 'email', 'gender', 'name'],
	    //profileFields   : ['id', 'birthday', 'email', 'first_name', 'gender', 'last_name'],
	   // //profileFields   : ["id", "birthday", "email", "first_name", "gender", "last_name"],
	    profileFields   : ["email", "displayName"],
       passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
	  },
	  async (req, accessToken, refreshToken, profile, done) => { 
    try {
      var r = await myapi.authenticate(accessToken, profile); 
      if(!r.authorized) {
        done('unauthorized'); //error (calls the passport.authenticate callback)
      } else {
        done(null, { //no error (calls the passport.authenticate callback)
          token: r.token,
          fbid: profile.id,
          fb_access_token: accessToken,
          profile: profile
        });
      }
    }
    catch (e) {
      logger.error(e);
    }
    
	  	// console.log("h**********************");
	   //  	process.nextTick(function(){

	   //  		User.findOne({'id': profile.id}, function(err, user){
	   //  			if(err)
	   //  				return done(err);
	   //  			if(user)
	   //  				return done(null, user);
	   //  			else {
	   //  				var newUser = new User();
	   //  				newUser.facebook.id = profile.id;
	   //  				newUser.facebook.token = accessToken;
	   //  				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	   //  				newUser.facebook.email = profile.email[0].value;

	   //  				newUser.save(function(err){
	   //  					if(err)
	   //  						throw err;
	   //  					return done(null, newUser);
	   //  				})
	   //  				console.log(profile);
	   //  			}
	   //  		});
	   //  	});
	    }

	));


};