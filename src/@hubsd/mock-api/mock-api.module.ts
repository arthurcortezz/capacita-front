import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HUBSD_MOCK_API_DEFAULT_DELAY } from '@hubsd/mock-api/mock-api.constants';
import { HubsdMockApiInterceptor } from '@hubsd/mock-api/mock-api.interceptor';

import { environment } from '../../environments/environment';

@NgModule()
export class HubsdMockApiModule {
  static forRoot(mockApiServices: any[], config?: { delay?: number }): ModuleWithProviders<HubsdMockApiModule> {
    if (environment.mockApi) {
      return {
        ngModule: HubsdMockApiModule,
        providers: [
          {
            provide: APP_INITIALIZER,
            deps: [...mockApiServices],
            useFactory: () => (): any => null,
            multi: true
          },
          {
            provide: HUBSD_MOCK_API_DEFAULT_DELAY,
            useValue: config?.delay ?? 0
          },
          {
            provide: HTTP_INTERCEPTORS,
            useClass: HubsdMockApiInterceptor,
            multi: true
          }
        ]
      };
    }
  }
}
