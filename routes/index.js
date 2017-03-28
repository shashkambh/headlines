var express = require('express');
var router = express.Router();
var databaseTest = require('../scripts/database.js');
var rssTest = require('../scripts/rss.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/testdbAddSource', function(req, res, next) {
	databaseTest.addSource("Test2", "www.test2.com");
	res.send('You are testing the database!');
});

router.get('/testdbCheckSources', function(req, res, next) {
	databaseTest.testPrintSources();
});


// //////////// added below
router.get('/signup', function(req, res, next){
	res.render('signup', {message: ""});
});

router.get('/login', function(req, res, next){
	res.render('login', {message: ""});
});
// shashank wrote this

// added above 


router.get('/testUpdateAllFeeds', function(req, res, next) {
	rssTest.test();
	databaseTest.testPrintSources();
});

module.exports = router;
