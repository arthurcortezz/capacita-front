import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';

import { appRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from './graphql.module';
import { HubsdModule } from '@hubsd/hubsd.module';
import { appConfig } from './core/config/app.config';
import { LayoutModule } from './layout/layout.module';
import { HubsdConfigModule } from '@hubsd/services/config';
import { HubsdToastModule } from '@hubsd/components/toast';

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [
    CoreModule,
    HubsdModule,
    LayoutModule,
    GraphQLModule,
    BrowserModule,
    HttpClientModule,
    HubsdToastModule,
    BrowserAnimationsModule,
    HubsdConfigModule.forRoot(appConfig),
    RouterModule.forRoot(appRoutes, routerConfig),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
