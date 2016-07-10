var express = require('express');
var scraperjs = require('scraperjs');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send({});
});

router.get('/feed', function (req, res, next) {
    res.status(200).send({"test": true});
    var urls = [];

    scraperjs.StaticScraper.create('http://gloryowlcomix.blogspot.com/')
        .scrape(function ($) {
            return $(".separator a").map(function () {
                return $(this).attr('href');
            }).get();
        })
        .then(function (news) {
            console.log(news);
        });

});

module.exports = router;
