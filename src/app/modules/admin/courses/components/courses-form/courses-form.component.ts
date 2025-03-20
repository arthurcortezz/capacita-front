import { finalize, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

import { CoursesService } from '../../courses.service';
import { CourseLessonsInterface, CoursesInterface } from '../../courses.types';
import { HubsdToastService } from '@hubsd/services/toast';

@Component({
  selector: 'courses-form',
  templateUrl: './courses-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CoursesFormComponent implements OnInit, OnDestroy {
  public id: number;
  public lessons: FormArray;
  public form: UntypedFormGroup;
  public course: CoursesInterface;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly service: CoursesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastService: HubsdToastService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      image: ['', [Validators.required]],
      value: ['', [Validators.required]],
      lessons: this.formBuilder.array([]),
    });

    this.lessons = this.form.get('lessons') as FormArray;

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: CoursesInterface): void => {
            this.course = res;
            this.form.patchValue(res);
            const lessons = res.lessons.map((lesson) => {
              return this.formBuilder.group({
                type: lesson.type,
                title: lesson.title,
                pdfUrl: lesson.pdfUrl,
              });
            });
            this.form.setControl('lessons', this.formBuilder.array(lessons));
            this.course.lessons.forEach((lesson) => {
              this.addLesson(lesson);
            });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSaveOrUpdate(): void {
    this.form.disable();

    this.form.value.lessons = this.form.value.lessons.map((lesson, index) => {
      return {
        ...lesson,
        order: index + 1,
      };
    });
    this.form.value.value = parseFloat(this.form.value.value);

    if (this.id) {
      this.service
        .update(this.id, { ...this.form.value, id: this.id })
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, { handleRequest: true });
            this.router.navigateByUrl('cursos');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o curso.',
              { handleRequest: true }
            );
          },
        });
    } else {
      this.service
        .create(this.form.value)
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, { handleRequest: true });
            this.router.navigateByUrl('cursos');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar o curso.',
              { handleRequest: true }
            );
          },
        });
    }
  }

  getLessons() {
    return this.form.get('lessons') as FormArray;
  }

  addLesson(lesson?: CourseLessonsInterface): void {
    const newLesson = this.formBuilder.group({
      title: [lesson ? lesson.title : '', Validators.required],
      type: [lesson ? lesson.type : '', Validators.required],
      pdfUrl: [lesson ? lesson.pdfUrl : '', Validators.required],
    });
    this.lessons.push(newLesson);
    this.form.setControl('lessons', this.lessons);
    this.form.get('lessons').updateValueAndValidity();
    console.log(
      "🚀 ~ CoursesFormComponent ~ addLesson ~ this.form.get('lessons'):",
      this.form.get('lessons')
    );
  }

  removeLesson(index: number) {
    this.lessons.removeAt(index);
  }
}
