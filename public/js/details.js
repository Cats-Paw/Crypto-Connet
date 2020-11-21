'use strict';

function chartSetFour() {

  let chartObject = {
    type: 'line',
    data: {
      datasets: [{
        label: document.getElementById('name').textContent,
        data: [document.getElementById('6').value, document.getElementById('5').value, document.getElementById('4').value, document.getElementById('3').value, document.getElementById('2').value, document.getElementById('1').value, document.getElementById('0').value],
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
      }
    }
  };

  let ctx = document.getElementById('detailChart').getContext('2d');
  let myChart = new Chart(ctx, chartObject);
}
console.log(document.getElementById('6').value);

chartSetFour();
