import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { CoursesService } from '../../courses.service';
import { HubsdToastService } from '@hubsd/services/toast';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';
import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import {
  CourseFilterInterface,
  CourseLessonsInterface,
  CoursePaginatedInterface,
  CoursesInterface,
} from '../../courses.types';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';

@Component({
  selector: 'courses-view',
  templateUrl: './courses-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CoursesViewComponent implements OnInit, OnDestroy {
  public id: number;
  public course: CoursesInterface;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly service: CoursesService,
    private readonly toastService: HubsdToastService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly confirmationService: HubsdConfirmationService
  ) {}

  ngOnInit(): void {
    this.getCourse();
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

  handleAction(data: HubsdHeaderActionInterface): void {}
}
