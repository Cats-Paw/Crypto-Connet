'use strict';
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');
const cheerio = require('cheerio');
const Chart = require('chart.js');
const { get } = require('superagent');
// Environment variables
require('dotenv').config();

//Create Port
const PORT = process.env.PORT || 3000;

// Setup applicationapp
const app = express();
const guardian = process.env.the_guardian;
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.static('./public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//Routes
app.get('/', homehandler);
app.post('/search', searchesHandler);
console.log('process.env.the_guardian', process.env.the_guardian);
// Route Handlers
function homehandler(req, res) {
  const API = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=3`;
  const coin_market_cap = process.env.coin_market_cap;
  superagent.get(API)
    .set('X-CMC_PRO_API_KEY', coin_market_cap)
    .then(data => {
      let graphData = data.body.data.map(coin => new CMC(coin));
      let chartData1 = [];
      let chartData2 = [];
      let chartData3 = [];
      graphData.forEach((coin, idx) => {
        let oldPrice = coin.price;
        if (idx === 1) {
          for (let i = 0; i < 7; i++) {
            oldPrice -= (coin.price * (coin.weeklyChange / 100 / 7));
            chartData1.push(oldPrice);
          }
        }
        else if (idx === 2) {
          for (let i = 0; i < 7; i++) {
            oldPrice -= (coin.price * (coin.weeklyChange / 100 / 7));
            chartData2.push(oldPrice);
          }
        }
        else {
          for (let i = 0; i < 7; i++) {
            oldPrice -= (coin.price * (coin.weeklyChange / 100 / 7));
            chartData3.push(oldPrice);
          }
        }
      });
      let chartArray = [];
      chartArray.push(chartData1);
      chartArray.push(chartData2);
      chartArray.push(chartData3);
      res.status(200).render('pages/index', { chart: chartArray });
    })
    .catch((error) => console.log(error));
  const APItwo = `https://content.guardianapis.com/search?q=cryptocurrency&api-key=${guardian}`;
  console.log('guardian', guardian);
  superagent.get(APItwo)
    .then(data => {
      let NewsArr = data.body.response.results.map( article => new News(article));
      // res.status(200).render('pages/index', {news: NewsArr}); work in progress
    })
    .catch((error) => console.log(error));
}

function searchesHandler(req, res) {
  //console.log('req.body.min_search', req.body.min_search);

  const minSearch = req.body.min_search;
  const maxSearch = req.body.max_search;
  const ascOrDesc = req.body.ascOrDesc;
  let ascOrDescAPI = '';

  if (ascOrDesc === 'asc') {
    ascOrDescAPI = ascOrDesc;
  }
  else if (ascOrDesc === 'desc') {
    ascOrDescAPI = ascOrDesc;
  }

  if (minSearch > maxSearch) {
    res.redirect('/');
  } else {
    const API = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=6&price_min=${minSearch}&price_max=${maxSearch}&sort=price&sort_dir=${ascOrDescAPI}`;
    const coin_market_cap = process.env.coin_market_cap;

    superagent.get(API)
      .set('X-CMC_PRO_API_KEY', coin_market_cap)
      .then(results => {
        let searchResults = results.body.data.map(prices => {
          //console.log('prices', prices.quote.USD.price); WORKS
          return new CMC(prices);
        });
        res.status(200).render('./pages/show', { results : searchResults});
      })
      .catch((error) => console.log(error));
  }


}

//Constructors

function CMC(obj) {//CMC = coinMarketCap
  this.name = obj.name;
  this.symbol = obj.symbol;
  this.price = obj.quote.USD.price;
  this.dailyChange = obj.quote.USD.percent_change_24h;
  this.weeklyChange = obj.quote.USD.percent_change_7d;
}

// app.post('/search', searchHandler)

// function searchHandler (req, res){
// const search = request.body.status

// }






























//Start Server
client.connect()
  .then(() => app.listen(PORT, () => console.log(`Server now listening on port ${PORT}.`)))
  .catch(err => console.log('ERROR:', err));





















