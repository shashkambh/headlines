var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');

/* constants used for connection */
var url = 'mongodb://localhost:27017/maindb'
var _db;

/*
 * Connects to the server if needed, then lets callback handle query
 */
var connect = function(callback) {
  	if(!_db) {
		MongoClient.connect(url, function(err, db) {
            if(err) throw err;
		  	_db = db;
		  	var articles = _db.collection('articles');
		  	articles.createIndex( {"link": 1}, { unique: true } ); /* faster */
		  	return callback();
		});
	} else {
		return callback();
	}
}

/*
 * Adds items (articles) to collection
 */
function updateArticles(items, callback) {
    var cb = callback ? callback : function(err, feeds){};

	connect(function() {
		var articles = _db.collection('articles');
		articles.insertMany(items, {ordered : false}, cb);
	});
}

/*
 * Returns 'limit' (#) articles for given list of feedLinks
 * FIX: doesn't always return articles from everything in the feedLinks
 * 		possibly because of $slice 
 */
function getArticlesFeedList(feedLinks, limit, callback) {
	feedLinks = [].concat(feedLinks);
	connect(function() {
		var articles = _db.collection('articles');
		articles.find({feed_link : {
			$in : feedLinks
		}}).
		limit(limit).
		sort({date: -1}).
		toArray(function(err, docs) {
			callback(docs, err);
		});
	});
}

/*
    User object format:
    {username:string, password:string}
    password is a hash, extended 8x
 */

// registers a user (adds a user)
function addUser(req, username, password, done){
    connect(function() {
        var users = _db.collection('users');
        var user = users.findOne({'username': username}, function(err, user) {
			if(err) throw err;
            var newUser = null;
			if(!user){
				var hash = bcrypt.hashSync(password, 8);
				newUser = {
					'username': username,
					'password': hash,
					'favSources': []
				};
				users.insert(newUser);
				req.session.success = 'You are successfully registered ' + newUser.username + '!';
			} else {
				req.session.signuperror = 'That username is already taken, please try a different one.';
			}
			done(null, newUser);
		});
    });
}

// logs in a user (checks the database for authentication)
function userLogin(req, username, password, done){
    connect(function() {
        var users = _db.collection('users');
        var user = users.findOne({'username': username}, function(err, user) {
			if(err) throw err;
			if(user && bcrypt.compareSync(password, user.password)){
				req.session.success = 'You are successfully logged in '+ user.username + '!';
				done(null, user);
			}
			else {
				req.session.loginerror = 'Could not log user in. Please try again.';
				done(false);
			}
		});
    });
}



function addUserFeed(req, res, user, rssSources){
	 connect(function() {
	 	var users = _db.collection('users');
        var updatedUser = {
					'username': user.username,
					'password': user.password,
					'favSources': rssSources
				};

        users.update({username: user.username}, 
        	{$set: {favSources: rssSources}}, 
        	{upsert: true});

        req.login(updatedUser, function(err) {
        	if (err) return err;
        });
        
	});
}

module.exports.testConnect = connect;
module.exports.updateArticles = updateArticles;
module.exports.getArticlesFeedList = getArticlesFeedList;
module.exports.addUser = addUser;
module.exports.userLogin = userLogin;
module.exports.addUserFeed = addUserFeed;

