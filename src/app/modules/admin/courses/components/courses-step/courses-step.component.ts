import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OnInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { CoursesService } from '../../courses.service';
import { CourseLessonsInterface, CoursesInterface } from '../../courses.types';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'courses-step',
  templateUrl: './courses-step.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CoursesStepComponent implements OnInit, OnDestroy {
  public id: number;
  sanitizedPdfUrl: SafeResourceUrl;
  public lesson: CourseLessonsInterface;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private sanitizer: DomSanitizer,
    private readonly service: CoursesService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCourse();
  }

  getCourse(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('idStep'));

      if (this.id) {
        void this.service
          .findLesson(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: CourseLessonsInterface): void => {
            this.lesson = res;
            this.sanitizedPdfUrl =
              this.sanitizer.bypassSecurityTrustResourceUrl(res.pdfUrl);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
