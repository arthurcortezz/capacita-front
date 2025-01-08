import { NgModule } from '@angular/core';
import { HubsdMediaWatcherService } from '@hubsd/services/media-watcher/media-watcher.service';

@NgModule({
  providers: [HubsdMediaWatcherService],
})
export class HubsdMediaWatcherModule {
  constructor() {}
}
