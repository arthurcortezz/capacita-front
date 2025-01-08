import { Chart } from 'tw-elements';
import {
  Input,
  OnInit,
  OnChanges,
  Component,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { BarChartInterface } from './interface/bar-chart.interface';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() icon: string;
  @Input() title: string;
  @Input() chartData: BarChartInterface;

  public data: BarChartInterface;
  public canvasIsLoaded: boolean = false;

  ngOnInit(): void {
    this.data = this.chartData;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.chartData.currentValue;
    setTimeout(() => {
      this.startBarsChart();
    }, 600);
  }

  startBarsChart(): void {
    const barChartStructure = {
      type: 'bar',
      data: {
        labels: this.data.name,
        datasets: [
          {
            label: 'Total por mês',
            borderColor: '#25D366',
            data: this.data.value,
            barBackgroundColor: '#25D366',
          },
        ],
      },
    };

    const barsChartOptions = {
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                color: '#fff',
                size: 18,
              },
            },
            position: 'top',
          },
          y1: {
            ticks: {
              color: '#fff',
              font: {
                size: 24,
              },
            },
          },
        },
        scales: {
          x: { display: false },
          x1: {
            stacked: false,
            grid: {
              borderDash: false,
              drawOnChartArea: true,
              color: 'rgba(1, 3, 2, 0.3)',
              borderWidth: 2,
            },
            ticks: {
              font: {
                size: 14,
              },
            },
          },
          y: {
            stacked: false,
            grid: {
              borderDash: false,
              drawOnChartArea: true,
              color: 'rgba(1, 3, 2, 0.3)',
              borderWidth: 2,
            },
            ticks: {
              font: {
                size: 14,
              },
            },
          },
        },
      },
    };
    new Chart(
      document.getElementById('barChart'),
      barChartStructure,
      barsChartOptions
    );
    this.canvasIsLoaded = true;
  }
}
