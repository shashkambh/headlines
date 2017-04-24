var express = require('express');
var router = express.Router();
var database = require('../scripts/database.js');

/* GET home page. */
/* TODO: articles come from database */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Headlines', articles: [], user: req.user });
});

module.exports = router;
