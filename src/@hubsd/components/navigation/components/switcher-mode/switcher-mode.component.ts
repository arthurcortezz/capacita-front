import {Component, Input, OnInit} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HubsdConfigService } from '@hubsd/services/config';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'hubsd-navigation-switcher-mode',
  templateUrl: './switcher-mode.component.html',
  styleUrls: ['./switcher-mode.component.scss'],
  animations: [
    trigger('slide', [
      state('light', style({ transform: 'translateX(0)' })),
      state('dark', style({ transform: 'translateX(100%)' })),
      transition('* => *', animate('300ms ease')),
    ]),
  ],
})
export class HubsdNavigationSwitcherModeComponent implements OnInit {
  @Input() hovered: boolean;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();
  public mode: string;

  constructor(private readonly configService: HubsdConfigService) {
    this.configService.config$.pipe(take(1), takeUntil(this.unsubscribeAll)).subscribe((config): void => {
      this.changeMode(config.scheme);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  ngOnInit(): void {}

  changeMode(mode: string): void {
    if (mode === 'auto') {
      this.mode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? 'dark'
        : 'light';
    } else {
      this.mode = mode;
    }

    this.configService.config = { scheme: mode };
  }
}
