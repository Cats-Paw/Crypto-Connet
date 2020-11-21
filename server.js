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

  const minSearch = req.body.min_search || req.body.min;
  const maxSearch = req.body.max_search ||req.body.max;

  const ascOrDesc = req.body.ascOrDesc || req.body.aOrD;
  let ascOrDescAPI = '';

  if (ascOrDesc === 'asc') {
    ascOrDescAPI = ascOrDesc;
  }
  else if (ascOrDesc === 'desc') {
    ascOrDescAPI = ascOrDesc;
  }
  if (parseInt(minSearch) > parseInt(maxSearch)) {
    res.redirect('/');
  } else {

    let number = req.body.number ? req.body.number : 1;
    let limit = 6;
    let start = (( number ) * limit);
    // console.log('number', number);
    // console.log('start', start);

    const API = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=6&price_min=${minSearch}&price_max=${maxSearch}&sort=price&sort_dir=${ascOrDescAPI}&start=${start}`;

    const coin_market_cap = process.env.coin_market_cap;

    number++;
    //console.log('number again', number);

    superagent.get(API)
      .set('X-CMC_PRO_API_KEY', coin_market_cap)
      .then(results => {
        let searchResults = results.body.data.map(prices => {
          //console.log('prices', prices.quote.USD.price); WORKS
          return new CMC(prices);
        });
        res.status(200).render('./pages/show', { results: searchResults, min : minSearch, max : maxSearch, aOrD : ascOrDescAPI, num : number });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).render('pages/searcherror');
      });
  }
}

function detailsHandler(req, res) {
  const coinName = req.body.name.toLowerCase();
  const coinSymbol = req.body.symbol;
  const coin_market_cap = process.env.coin_market_cap;
  let newCoin = coinName.split(' ');
  let joinCoin = newCoin.join('-');
  const guardian = process.env.the_guardian;
  const API = `https://api.coingecko.com/api/v3/coins/${joinCoin}/market_chart?vs_currency=USD&days=7&interval=daily`;
  const APInews = `https://content.guardianapis.com/search?q=cryptocurrency%20${coinName}&api-key=${guardian}`;
  const APIcmc = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${coinSymbol}`;
  console.log(API);
  console.log(APInews);
  console.log(APIcmc);
  superagent.get(API)
    .then(results => {
      if (results.body) {
        let totalPrices = [];
        results.body.prices.forEach(price => {
          //console.log('price ', price);
          totalPrices.push(price[1]);
        });
        if (totalPrices.length > 6) {
          return { chart: totalPrices, name: coinName };
        } else { res.status(200).render('pages/error', { name: coinName }); }
      }
    })
    .then(data => {
      superagent.get(APInews)
        .then(news => {
          let artArr = news.body.response.results.map(article => new News(article));
          artArr = artArr.slice(0, 3);
          // res.status(200).render('pages/details', { chart : data.chart, name: data.name, news: artArr});
          return { chart: data.chart, name: data.name, news: artArr };
        })
        .then(info => {
          superagent.get(APIcmc)
            .set('X-CMC_PRO_API_KEY', coin_market_cap)
            .then(coin => {
              let detailArr = [];
              let test = coin.body.data;
              let coinData = test[Object.keys(test)];
              let coinDetail = new CoinDetails(coinData);
              detailArr.push(coinDetail);
              res.status(200).render('pages/details', { chart: info.chart, name: info.name, news: info.news, details: detailArr });
            })
            .catch(error => console.log(error));
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      // console.log(error);
      res.status(200).render('pages/error', { name: coinName });
    });
}

function watchlistHandler(req, res) {
  const watchlistAdd = `INSERT INTO watch (symbol, title) VALUES($1, $2)`;
  const symbol = req.body.symbol;
  const name = req.body.name;
  const params = [symbol, name];
  console.log(req.body);
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
}

function deleteHandler(req, res) {
  const SQL = `DELETE FROM watch WHERE symbol=$1`;
  const params = [req.body.symbol];

  client.query(SQL, params)
    .then(results => {
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

function CoinDetails(obj) {
  this.disc = obj.description || 'No Description Available';
  this.icon = obj.logo || 'No logo Available';
  this.website = (obj.urls.website) ? obj.urls.website : 'No website available';
  this.reddit = (obj.urls.reddit) ? obj.urls.reddit : 'No Current Reddit Page, Start One?';
  this.name = obj.name;
  this.symbol = obj.symbol;
}

function News(obj) {
  this.headline = obj.webTitle;
  this.url = obj.webUrl;
}


//Start Server
client.connect()
  .then(() => app.listen(PORT, () => console.log(`Server now listening on port ${PORT}.`)))
  .catch(err => console.log('ERROR:', err));




















