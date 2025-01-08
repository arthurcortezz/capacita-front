import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';

import { HubsdToastService } from '@hubsd/services/toast';

import { CompaniesTypesService } from '../../companies-types.service';
import { CompanyTypeInterface } from '../../companies-types.types';

@Component({
  selector: 'companies-types-form',
  templateUrl: './companies-types-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompaniesTypesFormComponent implements OnInit, OnDestroy {
  public id: number;
  public companyType: CompanyTypeInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly service: CompaniesTypesService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: CompanyTypeInterface): void => {
            this.companyType = res;
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
            this.router.navigateByUrl('tipo-de-empresa');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o tipo de empresa.',
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
            this.router.navigateByUrl('tipo-de-empresa');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar o tipo de empresa.',
              { handleRequest: true }
            );
          },
        });
    }
  }
}
