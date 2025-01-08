import { Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { UserJWTInterface } from '../../../core/user/user.types';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { NavigationInterface } from '../../../core/navigation/navigation.types';

import { UserService } from '../../../core/user/user.service';
import { CommonService } from '../../../core/common/common.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { HubsdNavigationItem } from '@hubsd/components/navigation';

@Component({
  selector: 'sidebar-layout',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0%)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SidebarLayoutComponent implements OnInit, OnDestroy {
  public title = '';
  public companyTitle = null;
  public isMobile: boolean = false;
  public hovered: boolean = false;
  public navigation: HubsdNavigationItem[];

  @Input() item: HubsdNavigationItem;
  @Input() hover: boolean;

  menuVisible = false;

  private currentRoute = '';
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly common: CommonService,
    private readonly service: NavigationService,
    private readonly breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
    this.userService.user$.subscribe((res: UserJWTInterface) => {
      this.companyTitle = res.company ? res.company.name : null;
    });
    this.currentRoute = this.router.url.split('/')[1];

    this.router.events
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url.split('/')[1];
          const title = this.navigation.find((menu) =>
            menu.route.includes(this.currentRoute)
          );
          if (title) this.title = title.menu;
        }
      });
  }

  ngOnInit(): void {
    this.common
      .findAllCities()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe();

    this.service
      .get()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: UserJWTInterface) => {
        this.navigation = res.menus;
        const title = res.menus.find((menu) =>
          menu.route.includes(this.currentRoute)
        );
        if (title) this.title = title.menu;
        else this.title = '';
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
    const toggleElement = document.getElementById('toggle');
    if (toggleElement) {
      toggleElement.classList.remove('on');
    }
  }

  handleHovered(event: boolean): void {
    this.hovered = event;
  }

  menuToggle() {
    this.menuVisible = !this.menuVisible;
    const toggleElement = document.getElementById('toggle');

    if (toggleElement) {
      toggleElement.classList.toggle('on', this.menuVisible);
    }
  }
}
