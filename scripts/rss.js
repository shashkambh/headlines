var FeedParser = require("feedparser");
var request = require('request');
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');

var feedData = []

/* Sends an HTTP request to an RSS feed specified by the parameter.
 * Then sends the updated feed data to the database.
 */
function updateFeed(site){
    var req = request(site);
    var fp = new FeedParser();
	var items = [];

    req.on('response', function(res){
        var stream = this;
        if(res.statusCode !== 200){
            this.emit('error', new Error('failed'));
        } else {
            stream.pipe(fp);
        }
    });

    fp.on('readable', function (){
        var stream = this; 
        var meta = this.meta;
        var item;
        
        while (item = stream.read()){
            items.push({title: item.title, link: item.link, date: item.date});
        }
    });

    fp.on('end', function(){
        dbinterface.updateArticleList(site, items);
    });
    
}

/* Function passed into getFeedLinks, called with list of feed names
 * Calls updateFeed on every feed in the database
 */
function updateAllFeeds(feeds, err){
	if(err) return;
	
    feeds.forEach(function(element){
        updateFeed(element.feed_link);
    });
}

function updateFeedData() {
    dbinterface.getMostRecentArticles(function(docs, err) {
        feedData = []
        for(articles in docs) {
            feedData.concat(articles);
        }
    });
}



/* Updates all feeds every hour 
new CronJob('0 0 * * * *', function(){
	dbinterface.getFeedLinks(updateAllFeeds);
}, null, true, 'America/Chicago');
*/


module.exports.test = function(){
    dbinterface.addSource('xkcd', "http://xkcd.com/rss.xml");
    dbinterface.getFeedLinks(updateAllFeeds);
}

module.exports.feedData = feedData;
