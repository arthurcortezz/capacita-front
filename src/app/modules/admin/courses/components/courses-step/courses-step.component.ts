import { Subject, takeUntil } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ElementRef } from "@angular/core";

import { CoursesService } from "../../courses.service";
import { CoursesInterface } from "../../courses.types";
import { HubsdToastService } from "@hubsd/services/toast";
import { HubsdHeaderActionInterface } from "@hubsd/components/header";
import { HubsdConfirmationService } from "@hubsd/services/confirmation";

@Component({
  selector: "courses-step",
  templateUrl: "./courses-step.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CoursesStepComponent implements OnInit, OnDestroy {
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
      this.id = parseInt(params.get("id"));

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

  courseInit(): void {
    this.toastService.handleMessage("Em desenvolvimento");
  }

  handleAction(data: HubsdHeaderActionInterface): void {}
}
