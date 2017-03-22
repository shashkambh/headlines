var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/maindb';

// Use connect method to connect to the server
var connect = function() {

  MongoClient.connect(url, function(err, db) {
  	assert.equal(null, err);
  	console.log("Connected successfully to server");

  	db.close();
  });
}

function addSource(name, link) {
	MongoClient.connect(url, function(err, db) {
		var sources = db.collection('sources');
		sources.insert({
			name: name,
			feed_link: link,
			articles: []
		}, function(err, result) {
			db.close();
		});
	});
}

/* 
 * Return links to all feed sources
 */
function getFeedLinks(callback) {
	MongoClient.connect(url, function(err, db) {
		var sources = db.collection('sources');
		sources.find({}, {feed_link: 1, _id: 0}).toArray(function(err, docs) {
			callback(docs, err);
			db.close();
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
	MongoClient.connect(url, function(err, db) {
		var sources = db.collection('sources');
		sources.update( { feed_link: site },
			{ $addToSet : { articles : { $each : items } } }
		);
	});
}

function printSources() {
	MongoClient.connect(url, function(err, db) {
		var sources = db.collection('sources');
		sources.find().toArray(function(err, docs) {
			console.log(docs);
			db.close();
		});
	});
}

module.exports.testConnect = connect;
module.exports.addSource = addSource;
module.exports.getFeedLinks = getFeedLinks;
module.exports.updateArticleList = updateArticleList;
module.exports.testPrintSources = printSources;
