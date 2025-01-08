import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';

import { HubsdConfirmationDialogComponent } from './dialog/dialog.component';
import { HubsdConfirmationConfig } from './confirmation.types';

@Injectable({
  providedIn: 'root',
})
export class HubsdConfirmationService {
  private defaultConfig: HubsdConfirmationConfig = {
    title: 'Confirmar ação',
    message:
      'Você tem certeza de que deseja confirmar esta ação? <span class="font-semibold">Essa ação não pode ser desfeita!</span>',
    icon: {
      show: true,
      name: 'uil:warning',
      color: 'warn',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirmar',
        color: 'primary',
      },
      cancel: {
        show: true,
        label: 'Cancelar',
      },
    },
    dismissible: false,
  };
  constructor(private readonly matDialog: MatDialog) {}

  open(
    config: HubsdConfirmationConfig = {}
  ): MatDialogRef<HubsdConfirmationDialogComponent> {
    const userConfig = merge({}, this.defaultConfig, config);

    return this.matDialog.open(HubsdConfirmationDialogComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
      panelClass: 'hubsd-confirmation-dialog-panel',
    });
  }
}
