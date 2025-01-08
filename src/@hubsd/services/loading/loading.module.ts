import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HubsdLoadingInterceptor } from '@hubsd/services/loading/loading.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HubsdLoadingInterceptor,
      multi: true,
    },
  ],
})
export class HubsdLoadingModule {}
