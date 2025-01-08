import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HubsdConfirmationService } from '@hubsd/services/confirmation/confirmation.service';
import { HubsdConfirmationDialogComponent } from '@hubsd/services/confirmation/dialog/dialog.component';

@NgModule({
  declarations: [HubsdConfirmationDialogComponent],
  imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
  providers: [HubsdConfirmationService],
})
export class HubsdConfirmationModule {
  constructor() {}
}
