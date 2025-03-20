import { filter, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OnInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { CoursesService } from '../../courses.service';
import { CoursesInterface, CourseLessonsInterface } from '../../courses.types';

@Component({
  selector: 'courses-view',
  templateUrl: './courses-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CoursesViewComponent implements OnInit, OnDestroy {
  public id: number;
  public course: CoursesInterface;
  public hasActiveRoute: boolean = false;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly service: CoursesService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.verifyActiveRoute();
      });
  }

  ngOnInit(): void {
    this.getCourse();
    this.verifyActiveRoute();
  }

  getCourse(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: CoursesInterface): void => {
            this.course = res;
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  courseInit(lesson: CourseLessonsInterface): void {
    this.router.navigate([`/cursos/visualizar/${this.id}/${lesson.id}`]);
  }

  verifyActiveRoute(): void {
    const url = this.router.url;
    const regexExact = /^\/cursos\/visualizar\/\d+$/;
    const regexSub = /^\/cursos\/visualizar\/\d+\/\d+$/;

    if (regexExact.test(url)) {
      this.hasActiveRoute = true;
    } else if (regexSub.test(url)) {
      this.hasActiveRoute = false;
    } else {
      this.hasActiveRoute = false;
    }
  }
}
