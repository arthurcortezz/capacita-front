import { DOCUMENT } from '@angular/common';
import { BreakpointState } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject, combineLatest, filter, map, takeUntil } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Layout } from '../../layout/layout.types';
import { AppConfig } from '../../core/config/app.config';
import { HubsdConfigService } from '@hubsd/services/config';
import { HubsdMediaWatcherService } from '@hubsd/services/media-watcher';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
})
export class TermsComponent implements OnInit {
  public config: AppConfig;
  public layout: Layout;
  public scheme: 'dark' | 'light' | 'auto';
  public theme: string;
  private unsubscribeAll: Subject<void> = new Subject<void>();
  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,

    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly configService: HubsdConfigService,
    private readonly mediaWatcherService: HubsdMediaWatcherService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.configService.config$,
      this.mediaWatcherService.onMediaQueryChange$([
        '(prefers-color-scheme: dark)',
        '(prefers-color-scheme: light)',
      ]),
    ])
      .pipe(
        takeUntil(this.unsubscribeAll),
        map(([config, mql]: [AppConfig, BreakpointState]) => {
          const options = {
            scheme: config.scheme,
            theme: config.theme,
          };

          if (config.scheme === 'auto') {
            options.scheme = mql.breakpoints['(prefers-color-scheme: dark)']
              ? 'dark'
              : 'light';
          }

          return options;
        })
      )
      .subscribe((options) => {
        this.scheme = options.scheme;
        this.theme = options.theme;

        this.updateScheme();
        this.updateTheme();
      });

    this.configService.config$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((config: AppConfig) => {
        this.config = config;
        this.updateLayout();
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe(() => {
        this.updateLayout();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private updateLayout(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    this.layout = this.config.layout;

    const layoutFromQueryParam = route.snapshot.queryParamMap.get(
      'layout'
    ) as Layout;
    if (layoutFromQueryParam) {
      this.layout = layoutFromQueryParam;
      if (this.config) {
        this.config.layout = layoutFromQueryParam;
      }
    }

    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      if (
        path.routeConfig &&
        path.routeConfig.data &&
        path.routeConfig.data.layout
      ) {
        this.layout = path.routeConfig.data.layout;
      }
    });
  }

  private updateScheme(): void {
    this.document.body.classList.remove('light', 'dark');

    this.document.body.classList.add(this.scheme);
  }

  private updateTheme(): void {
    this.document.body.classList.forEach((className: string) => {
      if (className.startsWith('theme-')) {
        this.document.body.classList.remove(className, className.split('-')[1]);
      }
    });

    this.document.body.classList.add(this.theme);
  }
  clickBack(): void {
    this.router.navigate(['/']);
  }
}
