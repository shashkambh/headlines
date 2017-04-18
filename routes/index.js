var express = require('express');
var router = express.Router();
var databaseTest = require('../scripts/database.js');
var rssTest = require('../scripts/rss.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', articles: rssTest.feedData });
});

/* TODO: remove this code in production 
   Uncomment only for testing and make sure it is recommented before pushing*/
router.get('/testdbAddSource', function(req, res, next) {
	databaseTest.addFeed("Test200000", "www.test2.com");
	res.send('You are testing the database!');
});


router.get('/testdbCheckSources', function(req, res, next) {
	databaseTest.testPrintSources();
});

// TEST -- remove when done

router.get('/testAddUser', function(req, res, next) {
	databaseTest.addUser({	
		id: 123, 
		local: {
			username: "pranav",
			password: "password"
		},
		facebook: {
			id: "fbid",
			token: "fbtoken",
			email: "fbemail@fb.com",
			name: "pranav"
		} 
	});
});

router.get('/testFindUserUsername', function(req, res, next) {
	databaseTest.findUserByUsername("pranav");
	res.send("Testing find user by username.");
});

router.get('/testFindUserId', function(req, res, next) {
	databaseTest.findUserById(123);
	res.send("Testing find user by id.");
});


/*
router.get('/testUpdateAllFeeds', function(req, res, next) {
	rssTest.test();
	databaseTest.testPrintSources();
});
*/

module.exports = router;
