var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');

var url = 'mongodb://localhost:27017/maindb';
var _db;

// Use connect method to connect to the server
var connect = function(callback) {
  	if(!_db) {
		MongoClient.connect(url, function(err, db) {
            if(err) throw err;
		  	_db = db;
		  	return callback();
		});
	} else {
		return callback();
	}
}

/* 
 * Adds a feed
 */
function addFeed(name, link) {
	connect(function() {
		var sources = _db.collection('sources');
		sources.update({feed_link: link},
			{ $set : {
					name: name,
					feed_link: link,
					articles: []
				}
			},
			{upsert: true}
		);
	});
}

/* 
 * Return links to all feed sources
 */
function getFeedLinks(callback) {
	connect(function() {
		var sources = _db.collection('sources');
		sources.find({}, {feed_link: 1, _id: 0}).toArray(function(err, docs) {
			callback(docs, err);
		});
	});
}


/* 
 * Updates a feed's article list given the URL and posts to add
 * item: {
 *	title: something, link: somelink
 * }
 * items = [item1, item2, ...]
 */
function updateArticleList(site, items) {
	connect(function() {
		var sources = _db.collection('sources');
		sources.update( { feed_link: site },
			{ $addToSet : { articles : { $each : items } } }
		);
	});
}

/*
 * Returns { articles : [a1, a2, ...] } for a certain feed
 */
function getFeedArticles(feedLink, callback) {
	connect(function() {
		var sources = _db.collection('sources');
		sources.find({feed_link : feedLink}, { articles : 1, _id : 0 })
		.toArray(function(err, docs) {
			callback(docs, err);
		});
	});
}

/*
 * Return numArticles from each feed
 */
function getMostRecentArticles(feedLink, numArticles, callback) {
	connect(function() {
		var sources = _db.collection('sources');
		sources.find({}, { articles: 1, _id: 0})
		.limit(numArticles)
		.toArray(function(err, docs) {
			callback(docs, err);
		});
	});
}

function getAllFeedLinks(callback) {
	connect(function() {
		var sources = _db.collection('sources');
		sources.find({}, {feed_link: 1, _id: 0 })
		.toArray(function(err, docs) {
			callback(docs, err);
		});
	});
}

/*
 * Runs find all, for debugging
 */
function printSources() {
	connect(function() {
		var sources = _db.collection('sources');
		sources.find().toArray(function(err, docs) {
			console.log(docs);
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
					'password': hash
				};
				users.insert(newUser);
				req.session.success = 'You are successfully registered ' + newUser.username + '!';
			} else {
				req.session.error = 'That username is already taken, please try a different one.';
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
			} else {
				req.session.error = 'Could not log user in. Please try again.';
			}
			done(null, user);
		});
    });
}

module.exports.testConnect = connect;
module.exports.addFeed = addFeed;
module.exports.getFeedLinks = getFeedLinks;
module.exports.updateArticleList = updateArticleList;
module.exports.getFeedArticles = getFeedArticles;
module.exports.testPrintSources = printSources;
module.exports.getAllFeedLinks = getAllFeedLinks;
module.exports.getMostRecentArticles = getMostRecentArticles;
module.exports.addUser = addUser;
module.exports.userLogin = userLogin;

