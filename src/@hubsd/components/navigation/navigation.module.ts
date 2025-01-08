import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HubsdNavigationComponent } from '@hubsd/components/navigation/navigation.component';
import { HubsdNavigationItemComponent } from '@hubsd/components/navigation/components/item/item.component';
import { HubsdNavigationSwitcherModeComponent } from './components/switcher-mode/switcher-mode.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  declarations: [
    HubsdNavigationComponent,
    HubsdNavigationItemComponent,
    HubsdNavigationSwitcherModeComponent,
  ],
  exports: [HubsdNavigationComponent, HubsdNavigationSwitcherModeComponent],
})
export class HubsdNavigationModule {}
