import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { termUserRouting } from './term-user.routing';
import { SharedModule } from '../../../shared/shared.module';
import { HubsdHeaderModule } from '@hubsd/components/header/header.module';
import { TermUserFormComponent } from './components/term-user-form/term-user-form.component';

@NgModule({
  declarations: [TermUserFormComponent],
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
    RouterModule.forChild(termUserRouting),
  ],
})
export class TermUserModule {}
