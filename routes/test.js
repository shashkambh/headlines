var express = require('express');
var router = express.Router();
var jasmine = new (require('jasmine'))();
	
jasmine.loadConfigFile('spec/support/jasmine.json');

router.get('/test', function(req, res, next) {
	jasmine.execute();
});

module.exports = router;
