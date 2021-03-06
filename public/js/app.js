'use strict';
function chartSetOne() {

  let chartObject = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Ethereum',
        data: [document.getElementById('06').value, document.getElementById('05').value, document.getElementById('04').value, document.getElementById('03').value, document.getElementById('02').value, document.getElementById('01').value, document.getElementById('00').value], backgroundColor: 'rgb(134, 233, 127, 0.3)',
        borderColor: '#86E97F'
      }],
      labels: ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today'],
      backgroundColor: 'rgb(134, 233, 127, 0.3)'
    },
    options: {
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(134, 233, 127)',
          fontFamily: 'Goldman',
          fontSize: 20
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: 'rgb(134, 233, 127)',
            fontFamily: 'Goldman',
            fontSize: 15
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'rgb(134, 233, 127)',
            fontFamily: 'Goldman',
            fontSize: 15
          }
        }],
      }
    }
  };

  let ctx = document.getElementById('cryptoOne').getContext('2d');
  let myChart = new Chart(ctx, chartObject);
}

function chartSetTwo() {

  let chartObject = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Tether',
        data: [document.getElementById('16').value, document.getElementById('15').value, document.getElementById('14').value, document.getElementById('13').value, document.getElementById('12').value, document.getElementById('11').value, document.getElementById('10').value], backgroundColor: 'rgb(134, 233, 127, 0.3)',
        borderColor: '#86E97F'
      }],
      labels: ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today']
    },
    options: {
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(134, 233, 127)',
          fontFamily: 'Goldman',
          fontSize: 20
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: 'rgb(134, 233, 127)',
            fontFamily: 'Goldman',
            fontSize: 15
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'rgb(134, 233, 127)',
            fontFamily: 'Goldman',
            fontSize: 15
          },
        }],
      }
    }
  };

  let ctx = document.getElementById('cryptoTwo').getContext('2d');
  let myChart = new Chart(ctx, chartObject);
}

function chartSetThree() {

  let chartObject = {
    type: 'line',
    data: {
      datasets: [{
        label: 'BitCoin',
        data: [document.getElementById('26').value, document.getElementById('25').value, document.getElementById('24').value, document.getElementById('23').value, document.getElementById('22').value, document.getElementById('21').value, document.getElementById('20').value], backgroundColor: 'rgb(134, 233, 127, 0.3)',
        borderColor: '#86E97F'
      }],
      labels: ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today']
    },
    options: {
      legend: {
        display: true,
        labels: {
          fontColor: 'rgb(134, 233, 127)',
          fontFamily: 'Goldman',
          fontSize: 20
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: 'rgb(134, 233, 127)',
            fontFamily: 'Goldman',
            fontSize: 15
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: 'rgb(134, 233, 127)',
            fontFamily: 'Goldman',
            fontSize: 15
          }
        }],
      }
    }
  };

  let ctx = document.getElementById('cryptoThree').getContext('2d');
  let myChart = new Chart(ctx, chartObject);
}

const modal = document.getElementById('modal');
const modalButton = document.getElementById('searchButton');
const closeButton = document.getElementById('close');

modalButton.onclick = function (event) {
  modal.style.display = ' block ';
};

closeButton.onclick = function (event) {
  modal.style.display = ' none ';
};



chartSetOne();
chartSetTwo();
chartSetThree();

