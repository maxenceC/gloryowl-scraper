# gloryowl-scraper
a scraper for the french comic gloryowlcomix (http://gloryowlcomix.blogspot.com/)

### Run the app

`git clone https://github.com/maxenceC/gloryowl-scraper`

`cd gloryowl-scraper`

`forever start ./bin/www`

### Scrape the website

Once the app is running, go to :

`http://localhost:3000/fetchComics` 

(or whatever localhost/ip/port if you are not running a local server or changed the local port)

Then approx. 20 sec : 

`http://localhost:3000/comics`

You'll get all the comics formatted in Json

