var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Allcomics = [];
var lastScraping = null;

var app = express();

/* GET home page. */
app.get('/comics', function (req, res, next) {
    return res.status(200).send({comics: Allcomics});
});

app.get('/fetch-comics', function (req, res, next) {

    if (lastScraping !== null) {
        var date2 = new Date();
        var timeDiff = Math.abs(date2.getTime() - lastScraping.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        console.log(diffDays);
    }

    if (lastScraping === null || diffDays > 1) {
        console.info('start scrapping');
        lastScraping = new Date();
        Allcomics = [];
        scrapeTargetPage('http://gloryowlcomix.blogspot.com');
        return res.status(200).send({"message": "lauching_scrapper"});
    }else {
        return res.status(200).send({"message": "already_scrapped_today"});
    }

});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
});


/*
 Scrapper
 */

var scraperjs = require('scraperjs');
var scrapRouter = new scraperjs.Router();

var scrapeTargetPage = function (page) {
    scraperjs.StaticScraper.create(page)
        .scrape(function ($) {

            var shouldContinue = true;
            var nextPage;
            var comicsLinks = [];

            if ($(".blog-pager-older-link")[0]) {
                nextPage = $(".blog-pager-older-link")[0].attribs.href;
                comicsLinks = $(".hentry").map(function () {
                    const comicReference = $(this).find('.entry-title a').text();
                    const comicImg = $(this).find('.separator a').attr('href');

                    return {
                        _id: comicReference,
                        img: comicImg
                    };


                }).get();
            } else {
                shouldContinue = false;
                comicsLinks = [];
            }


            return {comics: comicsLinks, nextPage: nextPage, shouldContinue: shouldContinue}
        })
        .then(function (comics) {
            Allcomics = Allcomics.concat(comics.comics);
            if (comics.shouldContinue) {
                scrapeTargetPage(comics.nextPage)
            } else {
                console.log('done scraping');
            }
        });
};


module.exports = app;





