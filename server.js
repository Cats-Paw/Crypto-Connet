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

function homehandler(req, res) {
  const API = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=3`;
  const coin_market_cap = process.env.coin_market_cap;
  superagent.get(API)
    .set('X-CMC_PRO_API_KEY', coin_market_cap)
    .then(data => {
      let graphData = data.body.data.map(coin => new CMC(coin));
      console.log(graphData);
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
      console.log(chartData3);
      res.status(200).render('pages/index', { chart: chartData3 });
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

//Start Server
client.connect()
  .then(() => app.listen(PORT, () => console.log(`Server now listening on port ${PORT}.`)))
  .catch(err => console.log('ERROR:', err));





















