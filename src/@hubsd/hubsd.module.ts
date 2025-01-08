import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { HubsdMediaWatcherModule } from '@hubsd/services/media-watcher';
import { HubsdLoadingModule } from '@hubsd/services/loading';
import { HubsdConfirmationModule } from '@hubsd/services/confirmation';

@NgModule({
  imports: [
    HubsdLoadingModule,
    HubsdMediaWatcherModule,
    HubsdConfirmationModule,
  ],
  providers: [
    {
      provide: MATERIAL_SANITY_CHECKS,
      useValue: {
        doctype: true,
        theme: false,
        version: true,
      },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
        floatLabel: 'always',
      },
    },
  ],
})
export class HubsdModule {
  constructor(@Optional() @SkipSelf() parentModule?: HubsdModule) {
    if (parentModule) {
      throw new Error(
        'HubsdModule has already been loaded. Import this module in the AppModule only.'
      );
    }
  }
}
