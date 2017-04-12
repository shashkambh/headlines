var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var db = requre("./database.js");
var configAuth = require('./auth');
var bcrypt = require("bcrypt-nodejs");

function generateHash(password){
    return bcrypt.hashSync(password, 9);
}

function passwordMatches(user, password){
    return bcrypt.compareSync(password, user.local.password);
}


passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    db.findUserById(id, function(err, user){
        done(err, user);
    });
});

var passportStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
});

passport.use('local-signup', passportStrategy,
    function(req, email, password, done){
        process.nextTick(function(){
            db.findUserByUsername(email, function(err, user){
                if(err) return done(err);

                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email already taken'));
                } else {
                    var newUser = {};
                    newUser.local.username = email;
                    newUser.local.password = generateHash(password);
                    db.addUser(newUser);
                }
            });
        });
    });

passport.use('local-login', passportStrategy,
    function(req, email, password, done){
        process.nextTick(function(){
            db.findUserByUsername(email, function(err, user){
                    if(err) return done(err);

                    if(!user)
                        return done(null, false, req.flash('loginMessage', 'No User found'));

                    if(!passwordMatches(user, password)){
                        return done(null, false, req.flash('loginMessage', 'invalid password'));
                    }

                    return done(null, user);
            });
        });
    }
);

var facebookparams = {
clientID: configAuth.facebookAuth.clientID,
          clientSecret: configAuth.facebookAuth.clientSecret,
          callbackURL: configAuth.facebookAuth.callbackURL,
          profileFields   : ["email", "displayName"],
          passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
};


passport.use('facebook', new FacebookStrategy(facebookparams,

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

    }
));


