import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../app/core/user/user.service';
import { Location } from '@angular/common';

interface BreadcrumbInterface {
  label: string;
  url: string;
}
@Component({
  selector: 'hubsd-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  exportAs: 'hubsdHeader',
})
export class HubsdHeaderComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() info: boolean;
  @Input() buttonActionTitle: string;
  @Input() selection = new SelectionModel<number>(true, []);
  @Output() actionListener: EventEmitter<any> = new EventEmitter();

  public items: BreadcrumbInterface[];
  public creatable: boolean;

  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    const menuKey = this.activatedRoute.snapshot.data.menuKey;

    this.userService.user$.subscribe((user) => {
      this.creatable = user.privileges
        .map((item) => item.key)
        .includes(`${menuKey}_CRIAR`);
    });
    this.items = [...this.createBreadcrumbs(this.activatedRoute.root)];
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribeAll),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(
        () =>
          (this.items = [...this.createBreadcrumbs(this.activatedRoute.root)])
      );
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbInterface[] = []
  ): BreadcrumbInterface[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['title'] as string;

      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
  }
  goBack(): void {
    this.location.back(); // Implementar a funcionalidade de voltar
  }
}
