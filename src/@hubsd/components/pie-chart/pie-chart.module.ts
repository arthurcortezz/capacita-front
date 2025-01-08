import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PieChartComponent } from '@hubsd/components/pie-chart/pie-chart.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PieChartComponent],
  imports: [CommonModule, MatProgressBarModule, NgxChartsModule, MatIconModule],
  exports: [PieChartComponent, NgxChartsModule],
})
export class HubsdPieChartModule {}
