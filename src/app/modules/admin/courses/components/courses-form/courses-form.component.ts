import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { finalize, Subject, takeUntil } from "rxjs";

import { HubsdToastService } from "@hubsd/services/toast";

import { CoursesService } from "../../courses.service";
import { CoursesInterface } from "../../courses.types";

@Component({
  selector: "courses-form",
  templateUrl: "./courses-form.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CoursesFormComponent implements OnInit, OnDestroy {
  public id: number;
  public course: CoursesInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly service: CoursesService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      duration: ["", [Validators.required]],
      image: ["", [Validators.required]],
      value: ["", [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get("id"));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: CoursesInterface): void => {
            this.course = res;
            this.form.patchValue(res);
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
            this.router.navigateByUrl("cursos");
          },
          error: (error) => {
            this.toastService.handleMessage(error, "Não foi possível modificar o perfil de acesso.", { handleRequest: true });
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
            this.router.navigateByUrl("cursos");
          },
          error: (error) => {
            this.toastService.handleMessage(error, "Não foi possível criar o perfil de acesso.", { handleRequest: true });
          },
        });
    }
  }
}
