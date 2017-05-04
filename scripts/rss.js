var FeedParser = require("feedparser");
var request = require('request');
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');

var feedData = {};
var pendingFeeds = 0;
var items = [];

/* Sends an HTTP request to an RSS feed specified by the parameter.
 * Then sends the updated feed data to the database.
 */
function updateFeed(category, site, feed){
    var req = request(site);
    var fp = new FeedParser();
    pendingFeeds++;

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
            items.push({title: item.title, link: item.link, date: item.date, category: category, site: site, feed_link: feed});
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
function updateAllFeeds(feeds, err){
    for(site in feedSources.links.news){
        updateFeed(category, site, feedSources.links.news[site]);
    }

    for(site in feedSources.links.sports){
        updateFeed(category, site, feedSources.links.sports[site]);
    }

    for(site in feedSources.links.misc){
        updateFeed(cateogory, site, feedSources.links.misc[site]);
    }

    for(site in feedSources.links.tech){
        updateFeed(category, site, feedSources.links.tech[site]);
    }
}

// Updates all feeds every hour 
new CronJob('0 0 * * * *', updateAllFeeds, null, true, 'America/Chicago');

module.exports.feedData = feedData;
module.exports.defaults = ['http://xkcd.com/rss.xml', 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk'];
