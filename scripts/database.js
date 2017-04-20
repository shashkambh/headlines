var MongoClient = require('mongodb').MongoClient,
   assert = require('assert'), bcrypt = require('bcryptjs'),
    Q = require('q');;

var url = 'mongodb://localhost:27017/maindb';
var _db;

// Use connect method to connect to the server
var connect = function(callback) {
  	if(!_db) {
		MongoClient.connect(url, function(err, db) {
			assert.equal(null, err);
		  	console.log("Connected successfully to server");
		  	_db = db;
		  	callback();
		});
	} else {
		callback();
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
		var sources = db.collection('sources');
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
    {id: int, local:{username: String, password: String}, facebook:{id:String, token:String, email:String, name:String}}
    id needs to be a unique identifier
 */

// registers a user (adds a user)
function addUser(username, password){
	var deferred = Q.defer();
  
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('localUsers');

    //check if username is already assigned in our database
    collection.findOne({'username' : username})
      .then(function (result) {
        if (null != result) {
          console.log("USERNAME ALREADY EXISTS:", result.username);
          deferred.resolve(false); // username exists
        }
        else  {
          var hash = bcrypt.hashSync(password, 8);
          var user = {
            "username": username,
            "password": hash,
            "avatar": "http://cdn2-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-8.jpg"
          }

          console.log("CREATING USER:", username);
        
          collection.insert(user)
            .then(function () {
              db.close();
              deferred.resolve(user);
            });
        }
      });
  });

  return deferred.promise;
}

// logs in a user (checks the database for authentication)
function userLogin(username, password){
	var deferred = Q.defer();

  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('localUsers');

    collection.findOne({'username' : username})
      .then(function (result) {
        if (null == result) {
          console.log("USERNAME NOT FOUND:", username);

          deferred.resolve(false);
        }
        else {
          var hash = result.password;

          console.log("FOUND USER: " + result.username);

          if (bcrypt.compareSync(password, hash)) {
            deferred.resolve(result);
          } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve(false);
          }
        }

        db.close();
      });
  });

  return deferred.promise;
}


function findUserByUsername(usernameInp) {	
	connect(function() {
		var sources = _db.collection('users');
		sources.find({ "username": usernameInp}
		).toArray(function(err, docs) {
			console.log(docs);
		});
	}); 

}
function findUserById(id) {
	//TODO
	connect(function() {
		var sources = _db.collection('users');
		sources.find({ _id: id}
		).toArray(function(err, docs) {
			console.log(docs);
		});
	});
}

/*
function addUser(user) {
	connect(function() {
		var sources = _db.collection('users');
		var projection = { 
			$set : {
					_id: user.id, // TODO: remove
					local: user.local,
					facebook: user.facebook
				}
		};
		sources.update({_id: user.id}, projection, {upsert: true});
	});
}
*/

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
module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserById = findUserById;