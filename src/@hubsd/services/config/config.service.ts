import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { merge } from 'lodash-es';

import { HUBSD_APP_CONFIG } from '@hubsd/services/config/config.constants';

@Injectable({
  providedIn: 'root',
})
export class HubsdConfigService {
  private data: BehaviorSubject<any>;

  constructor(@Inject(HUBSD_APP_CONFIG) config: any) {
    this.data = new BehaviorSubject(config);
  }

  set config(value: any) {
    const config = merge({}, this.data.getValue(), value);

    this.data.next(config);
  }

  get config$(): Observable<any> {
    return this.data.asObservable();
  }

  reset(): void {
    this.data.next(this.config);
  }
}
