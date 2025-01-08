import { Chart } from 'tw-elements';
import {
  Input,
  OnChanges,
  Component,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

import { ChartInterface } from './interface/pie-chart.interface';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PieChartComponent implements OnChanges {
  @Input() icon: string;
  @Input() title: string;
  @Input() chartData: ChartInterface;

  public data: any;
  public canvasIsLoaded: boolean = false;
  private piesChart!: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.chartData.currentValue;
    setTimeout(() => {
      this.startPiesChart();
    }, 600);
  }

  startPiesChart(): void {
    const pieChartStructure = {
      type: 'pie',
      data: {
        labels: this.data.name,
        datasets: [
          {
            label: 'Total',
            borderColor: '#E5097F',
            data: this.data.value,
            backgroundColor: [
              '#97EDB6',
              '#663000',
              '#25D366',
              '#FD6A49',
              '#2176AE',
              '#157A3A',
              '#CC7325',
              '#F22E02',
            ],
            barBackgroundColor: '#E5097F',
          },
        ],
      },
    };

    const piesChartOptions = {
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 20,
              },
            },
            position: 'left',
          },
        },
      },
    };

    if (this.piesChart) {
      this.piesChart.update(pieChartStructure.data, piesChartOptions.options);
    } else {
      this.piesChart = new Chart(
        document.getElementById('pieChart'),
        pieChartStructure,
        piesChartOptions
      );
    }
    this.canvasIsLoaded = true;
  }
}
