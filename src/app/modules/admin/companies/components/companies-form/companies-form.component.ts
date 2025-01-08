import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { CompaniesService } from '../../companies.service';
import { CompanyInterface } from '../../companies.types';
import { HubsdToastService } from '@hubsd/services/toast';
import {
  CityInterface,
  ViaCEPResponseInterface,
} from '../../../../../core/common/common.types';
import { CommonService } from '../../../../../core/common/common.service';
import { PhoneValidator } from '@hubsd/validators';

@Component({
  selector: 'companies-form',
  templateUrl: './companies-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompaniesFormComponent implements OnInit, OnDestroy {
  public cities: CityInterface[];
  public id: number;
  public company: CompanyInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly service: CompaniesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly toastService: HubsdToastService,
    private readonly common: CommonService
  ) {}

  ngOnInit(): void {
    this.common.cities$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res) => {
        this.cities = res;
      });
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      socialReason: ['', [Validators.required]],
      cnpj: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required, PhoneValidator.valid()]],
      cep: ['', [Validators.required]],
      city: [{ disabled: true, value: '' }, [Validators.required]],
      state: [{ disabled: true, value: '' }, [Validators.required]],
      cityId: ['', [Validators.required]],
      number: ['', [Validators.required]],
      street: ['', [Validators.required]],
      complement: ['', []],
      neighborhood: ['', [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: CompanyInterface): void => {
            this.company = res;
            this.form.patchValue({
              ...res,
              ...res.address,
              city: res.address.city.name,
              state: res.address.city.state.uf,
            });
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onChangeCEP(): void {
    if (this.form.get('cep').value.length === 8) {
      this.service
        .getInfoByCEP(this.form.get('cep').value)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((res: ViaCEPResponseInterface) => {
          const city = this.cities.find(
            (item) =>
              item.state.uf.toLowerCase() === res.uf.toLowerCase() &&
              item.name.toLowerCase() === res.localidade.toLowerCase()
          );

          this.form.patchValue({
            street: res.logradouro,
            cityId: city.id,
            neighborhood: res.bairro,
            city: city.name,
            state: city.state.uf,
          });
        });
    }
  }

  handleSaveOrUpdate(): void {
    this.form.disable();
    const formValue = {
      ...this.form.value,
    };

    if (this.id)
      this.service
        .update({ id: this.id, ...this.form.value })
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, {
              handleRequest: true,
            });
            this.router.navigateByUrl('empresas');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar a empresa.',
              { handleRequest: true }
            );
          },
        });
    else
      this.service
        .create({ ...formValue })
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, {
              handleRequest: true,
            });
            this.router.navigateByUrl('empresas');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar a empresa.',
              { handleRequest: true }
            );
          },
        });
  }
}
