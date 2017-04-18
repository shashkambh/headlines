var express = require('express');
var router = express.Router();
var databaseTest = require('../scripts/database.js');
var rssTest = require('../scripts/rss.js')

/* GET home page. */
router.get('/', function(req, res, next) {
	 console.log("index before");
  res.render('index', { title: 'Express', articles: rssTest.feedData });
  console.log("index after");
});

/* TODO: remove this code in production
   Uncomment only for testing and make sure it is recommented before pushing
router.get('/testdbAddSource', function(req, res, next) {
	databaseTest.addSource("Test2", "www.test2.com");
	res.send('You are testing the database!');
});

router.get('/testdbCheckSources', function(req, res, next) {
	databaseTest.testPrintSources();
});
*/

router.get('/testUpdateAllFeeds', function(req, res, next) {
	rssTest.test();
	databaseTest.testPrintSources();
});


router.get('/preferences', function(req, res, next) {
	res.render('preferences', {message: "allison_user_pref"});
}); 

module.exports = router;
