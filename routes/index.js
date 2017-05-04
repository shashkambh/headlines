var express = require('express');
var router = express.Router();
var database = require('../scripts/database.js');
var rss = require('../scripts/rss.js');
var feed_globals = require('../scripts/feed_globals.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    var sourceList = rss.defaults;
    if(req.user && req.user.favSources && req.user.favSources.length !== 0){
        sourceList = req.user.favSources;
    }
    database.getArticlesFeedList(sourceList, 20, function(articleList, err){
        if(err) throw err;
        database.testPrintSources();
        res.render('index', {articles: articleList, user:req.user, links: feed_globals.links});
    });
});

module.exports = router;
