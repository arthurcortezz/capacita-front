import { NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../../shared/shared.module';

import { HubsdHeaderModule } from '@hubsd/components/header/header.module';

import { dashboardRoutes } from './dashboard.routing';

@NgModule({
  declarations: [],
  imports: [
    NgIf,
    SharedModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    HubsdHeaderModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(dashboardRoutes),
  ],
})
export class DashboardModule {}
