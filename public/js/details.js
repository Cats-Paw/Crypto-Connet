'use strict';

function chartSetFour() {

  let chartObject = {
    type: 'line',
    data: {
      datasets: [{
        label: 'BitCoin',
        data: [document.getElementById('7').value, document.getElementById('6').value, document.getElementById('5').value, document.getElementById('4').value, document.getElementById('3').value, document.getElementById('2').value, document.getElementById('1').value, document.getElementById('0').value]
      }],
      labels: ['Day -7', 'Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Day -1', 'Today']
    }
  };

  let ctx = document.getElementById('detailChart').getContext('2d');
  let myChart = new Chart(ctx, chartObject);
}
//console.log(document.getElementById('7').value);

chartSetFour();
