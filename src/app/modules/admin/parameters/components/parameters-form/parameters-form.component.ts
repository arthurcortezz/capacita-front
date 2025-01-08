import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { ParameterInterface } from '../../parameters.types';
import { ParametersService } from '../../parameters.service';
import { HubsdToastService } from '@hubsd/services/toast';

@Component({
  selector: 'parameters-form',
  templateUrl: './parameters-form.component.html',
})
export class ParametersFormComponent implements OnInit, OnDestroy {
  public id: number;
  public parameter: ParameterInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly service: ParametersService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      key: ['', [Validators.required]],
      value: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: ParameterInterface) => {
            this.parameter = res;
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
            this.router.navigateByUrl('parametros-de-sistema');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o parâmetro de sistema.',
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
            this.router.navigateByUrl('parametros-de-sistema');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o parâmetro de sistema.',
              { handleRequest: true }
            );
          },
        });
    }
  }
}
