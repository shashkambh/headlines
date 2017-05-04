/* Contains RSS feed links */
module.exports.links = {
	news : {
        Fox: "http://feeds.foxnews.com/foxnews/latest",
        CNN: "http://rss.cnn.com/rss/cnn_topstories.rss", 
        CNBC: "http://www.cnbc.com/id/100003114/device/rss/rss.html", 
        BBC: "http://feeds.bbci.co.uk/news/rss.xml?edition=uk", 
        Reuters: "http://feeds.reuters.com/reuters/topNews",
        NYT: "http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        PBS: "http://feeds.feedburner.com/NewshourHeadlines",
        KXAN: "http://kxan.com/feed/",
        ABCTX: "http://abc13.com/feed/",
        TexasTribune: "https://www.texastribune.org/feeds/top-stories/"
    },
    sports : {
        ESPN: "http://www.espn.com/espn/rss/news",
        NFL: "http://www.espn.com/espn/rss/nfl/news",
        Tennis: "http://www.atpworldtour.com/en/media/rss-feed/xml-feed",
        FoxSports: "https://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU",
        B1G: "http://btn.com/feed/",
        B1GWisconsin: "http://btn.com/schools/wisconsin/feed/"
    },
    misc : {
        XKCD: "https://xkcd.com/rss.xml",
        reddit: "http://www.reddit.com/.rss"
    },
    tech : {
        Reuters: "http://feeds.reuters.com/reuters/technologyNews",
        Wired: "https://www.wired.com/feed/",
        Nature: "http://feeds.nature.com/nature/rss/current",
        BBC: "http://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk#",
        PBS: "http://feeds.feedburner.com/ScienceTechnologyPBSNewsHour",
        ScienceDailyTech: "https://rss.sciencedaily.com/top/technology.xml",
        ScienceDailyScience: "https://rss.sciencedaily.com/top/science.xml",
        ScienceDailyBlackHoles: "https://rss.sciencedaily.com/space_time/black_holes.xml"
    }
}