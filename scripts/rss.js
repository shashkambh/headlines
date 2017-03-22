var FeedParser = require("feedparser");
var request = require("request");
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');

/* Sends an HTTP request to an RSS feed specified by the parameter.
 * Then sends the updated feed data to the database.
 */
function updateFeed(site){
    var req = request('http://xkcd.com/rss.xml');
    var fp = new FeedParser();
    fp.reqData = {};
    fp.reqData.items = [];
    fp.reqData.site = site;

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
            this.reqData.items.push({title: item.title, link: item.link});
        }
    });

    fp.on('end', function(){
        console.log(this.reqData.items);
        dbinterface.updateArticleList(this.reqData.site, this.reqData.items);
    });
    
}

/* Function passed into getFeedLinks, called with list of feed names
 * Calls updateFeed on every feed in the database
 */
function updateAllFeeds(feeds, err){
	if(err) return;
	
    feeds.forEach(function(element){
        updateFeed(element);
    });
}

/* Updates all feeds every hour */
new CronJob('0 0 * * * *', function(){
	dbinterface.getFeedLinks(updateAllFeeds);
}, null, true, 'America/Chicago');

module.exports.test = function(){
    dbinterface.getFeedLinks(updateAllFeeds);
}
