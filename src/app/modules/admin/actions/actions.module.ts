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

import { actionsRoutes } from './actions.routing';
import { ActionsListComponent } from './components/actions-list/actions-list.component';
import { ActionsFormComponent } from './components/actions-form/actions-form.component';

@NgModule({
  declarations: [ActionsListComponent, ActionsFormComponent],
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
    RouterModule.forChild(actionsRoutes),
  ],
})
export class ActionsModule {}
