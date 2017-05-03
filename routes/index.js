var express = require('express');
var router = express.Router();
var database = require('../scripts/database.js');
var rss = require('../scripts/rss.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    var sourceList = rss.defaults;
    if(req.user && req.user.favSources !== []){
        sourceList = req.user.favSources;
    }
    database.getArticlesFeedList(sourceList, 2, function(articleList, err){
        if(err) throw err;
        res.render('index', {articles: articleList, user:req.user});
    });
});

module.exports = router;
