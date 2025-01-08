import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { HubsdLoadingBarComponent } from '@hubsd/components/loading-bar/loading-bar.component';

@NgModule({
  declarations: [HubsdLoadingBarComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [HubsdLoadingBarComponent],
})
export class HubsdLoadingBarModule {}
