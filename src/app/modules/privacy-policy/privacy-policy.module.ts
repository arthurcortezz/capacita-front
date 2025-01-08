import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { privacyRoutes } from './privacy-policy.routing';
import { SharedModule } from '../../shared/shared.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { HubsdHeaderModule } from '@hubsd/components/header/header.module';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    HubsdHeaderModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(privacyRoutes),
  ],
})
export class PrivacyPolicyModule {}
