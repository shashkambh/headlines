var FeedParser = require("feedparser");
var request = require('request');
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');
var feedSources = require('./feed_globals.js');

var feedData = {};
var pendingFeeds = 0;
var items = [];

/* Sends an HTTP request to an RSS feed specified by the parameter.
 * Then sends the updated feed data to the database.
 */
function updateFeed(category, site, feed){
    var req = request(feed);
    var fp = new FeedParser();
    var articleCount = 0;
    pendingFeeds++;

    req.on('response', function(res){
        var stream = this;
        if(res.statusCode !== 200) {
            console.log(res);
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
            if(articleCount < 10){
                items.push({title: item.title, link: item.link, date: item.date, category: category, site: site, feed_link: feed});
            }
            articleCount++;
        }
    });

    fp.on('end', function(){
        pendingFeeds--;
        if(pendingFeeds === 0){
            dbinterface.updateArticles(items);
            items = [];
        }
    });
    
    fp.on('error', function(err){
        console.log(err);
        console.log('Error in feed parsing for ', site);
    });
}

/* Function passed into getFeedLinks, called with list of feed names
 * Calls updateFeed on every feed in the database
 */
function updateAllFeeds(){
    for(category in feedSources.links){
        for(site in feedSources.links[category]){
            updateFeed(category, site, feedSources.links[category][site].link);
        }
    }
}
updateAllFeeds();

// Updates all feeds every day 
new CronJob('0 0 0 * * *', updateAllFeeds, null, true, 'America/Chicago');

module.exports.feedData = feedData;
module.exports.defaults = [feedSources.links.misc.XKCD.link, feedSources.links.tech.ScienceDailyBlackHoles.link, feedSources.links.news.BBC.link];
