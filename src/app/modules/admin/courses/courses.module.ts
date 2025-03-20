import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { coursesRoutes } from './courses.routing';
import { SharedModule } from '../../../shared/shared.module';
import { HubsdHeaderModule } from '@hubsd/components/header/header.module';
import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { CoursesFormComponent } from './components/courses-form/courses-form.component';
import { CoursesViewComponent } from './components/courses-view/courses-view.component';
import { CoursesStepComponent } from './components/courses-step/courses-step.component';

@NgModule({
  declarations: [
    CoursesListComponent,
    CoursesFormComponent,
    CoursesViewComponent,
    CoursesStepComponent,
  ],
  imports: [
    NgIf,
    CommonModule,
    SharedModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    PdfViewerModule,
    HubsdHeaderModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(coursesRoutes),
  ],
})
export class CoursesModule {}
