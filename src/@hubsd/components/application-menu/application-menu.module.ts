import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HubsdApplicationMenuComponent } from './application-menu.component';

@NgModule({
  imports: [MatIconModule],
  exports: [HubsdApplicationMenuComponent],
  declarations: [HubsdApplicationMenuComponent],
})
export class HubsdApplicationMenuModule {}
