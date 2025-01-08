import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { SharedModule } from '../../../shared/shared.module';
import { UserModule } from '../../common/user/user.module';

import { HubsdNavigationModule } from '@hubsd/components/navigation';
import { HubsdLoadingBarModule } from '@hubsd/components/loading-bar';
import { HubsdToastModule } from '@hubsd/components/toast';

import { SidebarLayoutComponent } from './sidebar.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SidebarLayoutComponent],
  imports: [
    HttpClientModule,
    RouterModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    UserModule,
    HubsdNavigationModule,
    HubsdLoadingBarModule,
    HubsdToastModule,
  ],
  exports: [SidebarLayoutComponent],
})
export class SidebarLayoutModule {}
