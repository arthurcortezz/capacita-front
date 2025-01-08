import { NgClass, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { HubsdMenuComponent } from './menu.component';

@NgModule({
  imports: [
    NgIf,
    NgClass,
    MatMenu,
    RouterLink,
    MatCheckbox,
    MatIconModule,
    MatMenuTrigger,
  ],
  exports: [HubsdMenuComponent],
  declarations: [HubsdMenuComponent],
})
export class HubsdMenuModule {}
