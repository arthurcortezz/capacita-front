import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../../shared/shared.module';
import { HubsdHeaderModule } from '@hubsd/components/header';

import { parametersRoutes } from './parameters.routing';

import { ParametersListComponent } from './components/parameters-list/parameters-list.component';
import { ParametersFormComponent } from './components/parameters-form/parameters-form.component';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  imports: [
    NgIf,
    SharedModule,
    MatIconModule,
    MatInputModule,
    TextFieldModule,
    MatButtonModule,
    MatDialogModule,
    HubsdHeaderModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(parametersRoutes),
  ],
  declarations: [ParametersListComponent, ParametersFormComponent],
})
export class ParametersModule {}
