/* Contains RSS feed links */
module.exports.links = {
	news : {
        Fox: {link: "http://feeds.foxnews.com/foxnews/latest", imgsrc: "/images/foxnews.png"}, 
        CNN: {link: "http://rss.cnn.com/rss/cnn_topstories.rss", imgsrc: "/images/cnn.jpeg"}, 
        CNBC: {link: "http://www.cnbc.com/id/100003114/device/rss/rss.html", imgsrc: "/images/cnbc.png"}, 
        BBC: {link: "http://feeds.bbci.co.uk/news/rss.xml?edition=uk", imgsrc: "/images/bbcnews.png"}, 
        Reuters: {link: "http://feeds.reuters.com/reuters/topNews", imgsrc: "/images/reuters.jpeg"},
        NYT: {link: "http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", imgsrc: "/images/nytimes.jpeg"}, 
        PBS: {link: "http://feeds.feedburner.com/NewshourHeadlines", imgsrc: "/images/pbs.jpeg" },
        KXAN: {link: "http://kxan.com/feed/", imgsrc: "/images/kxan.jpeg" },
        ABCTX: {link: "http://abc13.com/feed/", imgsrc: "/images/abc13.jpeg" },
        TexasTribune: {link: "https://www.texastribune.org/feeds/top-stories/", imgsrc: "/images/texastribune.png" }
    },
    sports : {
        ESPN: {link: "http://www.espn.com/espn/rss/news", imgsrc: "/images/espn.jpeg" },
        NFL: {link: "http://www.espn.com/espn/rss/nfl/news", imgsrc: "/images/nfl.jpeg"},
        Tennis: {link: "http://www.atpworldtour.com/en/media/rss-feed/xml-feed", imgsrc: "/images/tennis.png"}, 
        FoxSports: {link: "https://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU", imgsrc: "/images/foxsports.png"}, 
        B1G: {link: "http://btn.com/feed/", imgsrc: "/images/b1g.png" },
        B1GWisconsin: {link: "http://btn.com/schools/wisconsin/feed/", imgsrc: "/images/wisconsin.png"}
    },
    misc : {
        XKCD: {link: "https://xkcd.com/rss.xml", imgsrc: "/images/xkcd.png"} ,
        reddit: {link: "http://www.reddit.com/.rss", imgsrc: "/images/reddit.png"}
    },
    tech : {
        ReutersTech: {link: "http://feeds.reuters.com/reuters/technologyNews", imgsrc: "/images/reuters.jpeg"},
        Nature: {link: "http://feeds.nature.com/nature/rss/current", imgsrc: "/images/nature.png" },
        BBC: {link: "http://feeds.bbci.co.uk/news/technology/rss.xml?edition=uk#", imgsrc: "/images/bbcnews.png" },
        PBS: {link: "http://feeds.feedburner.com/ScienceTechnologyPBSNewsHour", imgsrc: "/images/pbs.jpeg" },
        ScienceDailyTech: {link: "https://rss.sciencedaily.com/top/technology.xml", imgsrc: "/images/science.jpg"},
        ScienceDailyScience: {link: "https://rss.sciencedaily.com/top/science.xml", imgsrc: "/images/science.jpg" },
        ScienceDailyBlackHoles: {link: "https://rss.sciencedaily.com/space_time/black_holes.xml", imgsrc: "/images/science.jpg" }
    }
}
