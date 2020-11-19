'use strict';
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');
const cheerio = require('cheerio');
const Chart = require('chart.js');
// Environment variables
require('dotenv').config();

//Create Port
const PORT = process.env.PORT || 3000;

// Setup applicationapp
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
app.use(express.static('./public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//Routes
app.get('/', homehandler);
app.post('/search', searchesHandler);
app.post('/viewDetails/:symbol', detailsHandler);
app.post('/watchList', watchlistHandler);
app.get('/renderWatchList', renderWatchListHandler);
app.delete('/delete/:symbol', deleteHandler);

// Route Handlers
function homehandler(req, res) {
  const API = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=3`;
  const coin_market_cap = process.env.coin_market_cap;
  const guardian = process.env.the_guardian;
  const APItwo = `https://content.guardianapis.com/search?q=cryptocurrency&api-key=${guardian}`;
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
      return chartArray;
    })
    .then(chart => {
      superagent.get(APItwo)
        .then(data => {
          let NewsArr = data.body.response.results.map(article => new News(article));
          NewsArr = NewsArr.slice(0, 3);
          console.log(NewsArr);
          res.status(200).render('pages/index', { chartdata: chart, newsData: NewsArr });
        })
        .catch((error) => console.log(error));
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
        res.status(200).render('./pages/show', { results: searchResults });
      })
      .catch((error) => console.log(error));
  }
}

function detailsHandler(req, res) {
  //console.log('name :', req.body.name); WORKS

  const coinName = req.body.name.toLowerCase();
  console.log('name', coinName);
  let newCoin = coinName.split(' ');
  console.log('newCoin', newCoin);
  let joinCoin = newCoin.join('-');
  console.log('joinCoin', joinCoin);
  const API = `https://api.coingecko.com/api/v3/coins/${joinCoin}/market_chart?vs_currency=USD&days=7&interval=daily`;

  superagent.get(API)
    .then(results => {
      if (results.body) {
        let totalPrices = [];
        results.body.prices.forEach(price => {
          //console.log('price ', price);
          totalPrices.push(price[1]);
        });
        console.log(totalPrices);
        if (totalPrices.length > 6) {
          res.status(200).render('pages/details', { chart: totalPrices, name: coinName });
        } else { res.status(200).render('pages/error', { name : coinName }); }

      }
    })
    .catch((error) => {
      console.log(error);
      res.status(200).render('pages/error', { name : coinName });
    });
}

function watchlistHandler(req, res) {
  const watchlistAdd = `INSERT INTO watch (symbol, name) VALUES($1, $2)`;
  const symbol = req.body.symbol;
  const name = req.body.name;
  const params = [symbol, name];
  client.query(watchlistAdd, params)
    .then(results => {
      res.status(200).redirect('/');
    })
    .catch((error) => console.log(error));
}

function renderWatchListHandler(req, res) {
  const watchListView = `SELECT * FROM watch`;

  client.query(watchListView)
    .then(results => {
      let watchView = results.rows;
      res.status(200).render('pages/watchlist', { results: watchView });




    })
    .catch((error) => console.log(error));
};

function deleteHandler(req, res){
  const SQL = `DELETE FROM watch WHERE symbol=$1`;
  const params = [req.body.symbol];

  client.query(SQL, params)
    .then(results =>{
      res.status(200).redirect('/');
    })
    .catch((error) => console.log(error));
}

//Constructors

function CMC(obj) {//CMC = coinMarketCap
  this.name = obj.name;
  this.symbol = obj.symbol;
  this.price = obj.quote.USD.price;
  this.dailyChange = obj.quote.USD.percent_change_24h;
  this.weeklyChange = obj.quote.USD.percent_change_7d;
}

function News(obj) {
  this.headline = obj.webTitle;
  this.url = obj.webUrl;
}


//Start Server
client.connect()
  .then(() => app.listen(PORT, () => console.log(`Server now listening on port ${PORT}.`)))
  .catch(err => console.log('ERROR:', err));




















