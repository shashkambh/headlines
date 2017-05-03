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


// news

dbinterface.addFeed('BBC', 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk');
dbinterface.addFeed('CNBC', 'http://www.cnbc.com/id/100003114/device/rss/rss.html');
dbinterface.addFeed('FOX', 'http://feeds.foxnews.com/foxnews/latest');
dbinterface.addFeed('CNN', 'http://rss.cnn.com/rss/cnn_topstories.rss');
dbinterface.addFeed('NFL', 'http://www.espn.com/espn/rss/nfl/news');
dbinterface.addFeed('Tennis', 'http://www.atpworldtour.com/en/media/rss-feed/xml-feed');
dbinterface.addFeed('Reuters', 'http://feeds.reuters.com/reuters/topNews');
dbinterface.addFeed('NYT', 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
dbinterface.addFeed('BuzzFeed', 'https://www.buzzfeed.com/tag/rss');
dbinterface.addFeed('PBS', 'http://feeds.feedburner.com/NewshourHeadlines');
dbinterface.addFeed('NYT', 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
dbinterface.addFeed('BuzzFeed', 'https://www.buzzfeed.com/tag/rss');
dbinterface.addFeed('KXAN', 'http://kxan.com/feed/');
dbinterface.addFeed('TexasTribune', 'https://www.texastribune.org/feeds/top-stories/');
dbinterface.addFeed('ABCTX', 'http://abc13.com/feed/');

// sports
dbinterface.addFeed('ESPN', 'http://www.espn.com/espn/rss/news');
dbinterface.addFeed('NFL', 'http://www.espn.com/espn/rss/nfl/news');
dbinterface.addFeed('Tennis', 'http://www.atpworldtour.com/en/media/rss-feed/xml-feed');
dbinterface.addFeed('FoxSports', 'https://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU');
dbinterface.addFeed('B1G', 'http://btn.com/feed/');
dbinterface.addFeed('B1GWisconsin', 'http://btn.com/schools/wisconsin/feed/');
dbinterface.addFeed('UTSports', 'http://www.texassports.com/rss.aspx');

// miscellaneous
dbinterface.addFeed('xkcd', 'http://xkcd.com/rss.xml');
dbinterface.addFeed('reddit', 'http://www.reddit.com/.rss');

//technology
dbinterface.addFeed('Reuters', 'http://feeds.reuters.com/reuters/technologyNews');
dbinterface.addFeed('Wired', 'https://www.wired.com/feed/');
dbinterface.addFeed('Nature', 'http://feeds.nature.com/nature/rss/current');
dbinterface.addFeed('BBC', 'http://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk#",');
dbinterface.addFeed('PBS', 'http://feeds.feedburner.com/ScienceTechnologyPBSNewsHour');
dbinterface.addFeed('ScienceDailyTech', 'https://rss.sciencedaily.com/top/technology.xml');
dbinterface.addFeed('ScienceDailyScience', 'https://rss.sciencedaily.com/top/science.xml');
dbinterface.addFeed('ScienceDailyBlackHoles', 'https://rss.sciencedaily.com/space_time/black_holes.xml');


dbinterface.getFeedLinks(updateAllFeeds);


module.exports.feedData = feedData;
module.exports.defaults = ['http://xkcd.com/rss.xml', 'http://feeds.bbci.co.uk/news/rss.xml?edition=uk'];
