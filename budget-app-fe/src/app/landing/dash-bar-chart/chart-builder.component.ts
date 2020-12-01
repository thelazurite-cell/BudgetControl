import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-dash-bar-chart',
  templateUrl: './chart-builder.component.html',
  styleUrls: ['./chart-builder.component.scss']
})
export class ChartBuilderComponent implements OnInit {
  public chartName = 'my chart';
  public chartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          callback: (label, index, labels) =>
            '$' + label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),

          beginAtZero: true
        }
      }]
    },
    scaleShowVerticalLines: true
  };
  public old = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            callback: (label) => {
              alert('fuckyou');
              return ' $' + label.value.toString();

            },
            scaleLabel: {
              display: true,
              labelString: '1k = 1000'
            }
          }
        }
      ]
    }
  };

  public chartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public chartType = 'bar';
  public showLegend = true;
  public chartColors = [
    'rgba(75, 192, 192, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(153, 102, 255, 0.5)'
  ];

  public chartData = [
    {
      data: [650, 590, 800, 801, 506, 505, 400],
      label: 'Series A',
    },
    {data: [208, 480, 400, 190, 860, 270, 900], label: 'Series B'}
  ];
  public chartLegend = {display: this.showLegend, position: 'right'};

  constructor() {
  }

  public constructDataModel() {
    const datasets = [];
    for (let i = 0; i < this.chartData.length; i++) {
      let color: string;
      if (i > this.chartColors.length) {
        const r = this.getColorValue();
        const g = this.getColorValue();
        const b = this.getColorValue();
        color = `rgba(${r},${g},${b},0.5)`;
      } else {
        color = this.chartColors[i];
      }
      datasets.push({
        data: this.chartData[i].data,
        label: this.chartData[i].label,
        backgroundColor: color,
        fill: true,
        borderWidth: 1
      });
    }
    return {
      labels: this.chartLabels,
      datasets
    };
  }

  private getColorValue(): number {
    return Math.floor(Math.random() * 255);
  }

  ngOnInit(): void {
  }
}
