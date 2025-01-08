import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BarChartComponent } from '@hubsd/components/bar-chart/bar-chart.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [BarChartComponent],
  exports: [BarChartComponent, NgxChartsModule],
  imports: [CommonModule, MatProgressBarModule, NgxChartsModule, MatIconModule],
})
export class HubsdBarChartModule {}
