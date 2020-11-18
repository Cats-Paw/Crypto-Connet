'use strict';
function chartSetOne() {

  let chartObject = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Ethereum',
        data: [document.getElementById('06').value, document.getElementById('05').value, document.getElementById('04').value, document.getElementById('03').value, document.getElementById('02').value, document.getElementById('01').value, document.getElementById('00').value]
      }],
      labels: ['Day -7', 'Day -6', 'Day -5', 'Day -4', 'Day -2', 'Day -1', 'Today']
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
        data: [document.getElementById('16').value, document.getElementById('15').value, document.getElementById('14').value, document.getElementById('13').value, document.getElementById('12').value, document.getElementById('11').value, document.getElementById('10').value]
      }],
      labels: ['Day -7', 'Day -6', 'Day -5', 'Day -4', 'Day -2', 'Day -1', 'Today']
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
        data: [document.getElementById('26').value, document.getElementById('25').value, document.getElementById('24').value, document.getElementById('23').value, document.getElementById('22').value, document.getElementById('21').value, document.getElementById('20').value]
      }],
      labels: ['Day -7', 'Day -6', 'Day -5', 'Day -4', 'Day -2', 'Day -1', 'Today']
    }
  };

  let ctx = document.getElementById('cryptoThree').getContext('2d');
  let myChart = new Chart(ctx, chartObject);
}

chartSetOne();
chartSetTwo();
chartSetThree();

