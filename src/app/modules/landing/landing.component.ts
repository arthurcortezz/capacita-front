import { DOCUMENT } from "@angular/common";
import { combineLatest, filter, map, Subject, takeUntil } from "rxjs";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Component, Inject, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";

import { Layout } from "../../layout/layout.types";
import { AppConfig } from "../../core/config/app.config";
import { HubsdConfigService } from "@hubsd/services/config";
import { HubsdMediaWatcherService } from "@hubsd/services/media-watcher";
import { BreakpointState } from "@angular/cdk/layout";

@Component({
  selector: "landing",
  templateUrl: "./landing.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class LandingComponent implements OnInit {
  public config: AppConfig;
  public layout: Layout;
  public scheme: "dark" | "light" | "auto";
  public theme: string;
  private unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,

    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly configService: HubsdConfigService,
    private readonly mediaWatcherService: HubsdMediaWatcherService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
