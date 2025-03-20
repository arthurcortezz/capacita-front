import { Subject } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Layout } from '../../layout/layout.types';
import { AppConfig } from '../../core/config/app.config';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LandingComponent implements OnInit {
  public config: AppConfig;
  public layout: Layout;
  public scheme: 'dark' | 'light' | 'auto';
  public theme: string;
  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
