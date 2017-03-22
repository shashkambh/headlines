var FeedParser = require("feedparser");
var request = require("request");
var CronJob = require('cron').CronJob;
var dbinterface = require('./database.js');

function updateFeed(site){
    var req = request(site);
    var fp = new FeedParser();

    req.on("response", function(res){
        var stream = this;
        if(res.statusCode != 200){
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
            items.unshift({title: item.title, link: item.link});
        }

        dbinterface.addFeed(items);
    });
}

function updateAllFeeds(){
    updateFeed('http://xkcd.com/rss.xml');
}

new CronJob('0 0 * * * *', updateAllFeeds, null, true, 'America/Chicago');
