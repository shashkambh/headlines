var FeedParser = require("feedparser");
var request = require("request");
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');

/* Sends an HTTP request to an RSS feed specified by the parameter.
 * Then sends the updated feed data to the database.
 */
function updateFeed(site){
    var req = request(site);
    var fp = new FeedParser();

    req.on("response", function(res){
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
        var items = [];
        
        while (item = stream.read()){
            items.push({title: item.title, link: item.link});
        }
4

        dbinterface.updateArticleList(site, items);
    });
}

/* Function passed into getFeedLinks, called with list of feed names
 * Calls updateFeed on every feed in the database
 */
function updateFeeds(feeds, err){
	if(err) return;
	
    feeds.forEach(function(element){
        updateFeed(element);
    });
}

/* Updates all feeds every hour */
new CronJob('0 0 * * * *', function(){
	dbinterface.getFeedLinks(updateAllFeeds);
}, null, true, 'America/Chicago');
