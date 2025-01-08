import { ModuleWithProviders, NgModule } from '@angular/core';
import { HUBSD_APP_CONFIG } from '@hubsd/services/config/config.constants';

@NgModule()
export class HubsdConfigModule {
  constructor() {}

  static forRoot(config: any): ModuleWithProviders<HubsdConfigModule> {
    return {
      ngModule: HubsdConfigModule,
      providers: [
        {
          provide: HUBSD_APP_CONFIG,
          useValue: config,
        },
      ],
    };
  }
}
