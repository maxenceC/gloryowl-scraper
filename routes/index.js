var express = require('express');
var scraperjs = require('scraperjs');
var router = express.Router();
var scrapRouter = new scraperjs.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send({});
});


router.route("https://www.youtube.com/watch/YE7VzlLtp-4", function () {
    console.log("i'm done");
});

router.get('/feed', function (req, res, next) {
    res.status(200).send({"test": true});

    scrapeTargetPage('http://gloryowlcomix.blogspot.com');

});

var scrapeTargetPage = function (page) {
    scraperjs.StaticScraper.create(page)
        .scrape(function ($) {
            var nextPage = $(".blog-pager-older-link")[0].attribs.href;

            const comicsLinks = $(".hentry").map(function () {
                const comicReference = $(this).find('.entry-title a').text();
                const comicImg = $(this).find('.separator a').attr('href');

                const comic = {
                    _id: comicReference,
                    img: comicImg
                };

                console.log(comic);
                return this;
            }).get();


            return {comics: comicsLinks, nextPage: nextPage}
        })
        .then(function (comics) {
            //console.log(comics.comics);
            //scrapeTargetPage(comics.nextPage)
        });
};

module.exports = router;
