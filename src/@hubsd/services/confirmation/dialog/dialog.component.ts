import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HubsdConfirmationConfig } from '@hubsd/services/confirmation/confirmation.types';

@Component({
  selector: 'hubsd-confirmation-dialog',
  templateUrl: './dialog.component.html',
  styles: [
    `
      .hubsd-confirmation-dialog-panel {
        @screen md {
          @apply w-128;
        }

        .mat-mdc-dialog-container {
          .mat-mdc-dialog-surface {
            padding: 0 !important;
          }
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HubsdConfirmationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HubsdConfirmationConfig
  ) {}
}
