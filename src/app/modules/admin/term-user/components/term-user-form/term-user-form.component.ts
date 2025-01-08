import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TermUserService } from '../../term-user.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';

import { TermUserInterface } from '../../term-user.types';

import { HubsdToastService } from '@hubsd/services/toast';

@Component({
  selector: 'term-user-form',
  templateUrl: './term-user-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TermUserFormComponent implements OnInit, OnDestroy {
  public form: UntypedFormGroup;
  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly toastService: HubsdToastService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly service: TermUserService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    void this.service
      .find()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: TermUserInterface): void => {
        this.form.patchValue(res);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSaveOrUpdate(): void {
    this.form.disable();

    this.service
      .save(this.form.value)
      .pipe(
        takeUntil(this.unsubscribeAll),
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe({
        next: (res) => {
          this.toastService.handleMessage(res, null, { handleRequest: true });
        },
        error: (error) => {
          this.toastService.handleMessage(
            error,
            'Não foi possível modificar o termo de serviço.',
            { handleRequest: true }
          );
        },
      });
  }
}
