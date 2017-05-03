var FeedParser = require("feedparser");
var request = require('request');
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');

var feedData = {};

/* Sends an HTTP request to an RSS feed specified by the parameter.
 * Then sends the updated feed data to the database.
 */
function updateFeed(site){
    var req = request(site);
    var fp = new FeedParser();
	var items = [];

    req.on('response', function(res){
        var stream = this;
        if(res.statusCode !== 200) {
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
    
    fp.on('error', function(){
        console.log('Error in feed parsing.');
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

// Updates all feeds every hour 
new CronJob('0 0 * * * *', function(){
	dbinterface.getFeedLinks(updateAllFeeds);
}, null, true, 'America/Chicago');


dbinterface.addFeed('xkcd', 'http://xkcd.com/rss.xml');
dbinterface.addFeed('BBC', 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk');
dbinterface.addFeed('CNBC', 'http://www.cnbc.com/id/100003114/device/rss/rss.html');
dbinterface.addFeed('FOX', 'http://feeds.foxnews.com/foxnews/latest');
dbinterface.addFeed('CNN', 'http://rss.cnn.com/rss/cnn_topstories.rss');
dbinterface.addFeed('Yahoo', 'http://apps.shareholder.com/rss/rss.aspx?channels=632&companyid=YHOO&sh_auth=4350265862%2E0%2E0%2E42851%2E51676db2d98fa83fe60151eb8eced4b5');
dbinterface.addFeed('ESPN', 'http://www.espn.com/espn/rss/news');
dbinterface.addFeed('NFL', 'http://www.espn.com/espn/rss/nfl/news');
dbinterface.addFeed('Tennis', 'http://www.atpworldtour.com/en/media/rss-feed/xml-feed');

dbinterface.getFeedLinks(updateAllFeeds);


module.exports.feedData = feedData;
module.exports.defaults = ['http://xkcd.com/rss.xml', 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk'];
