import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { HubsdToastService } from '@hubsd/services/toast';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

import { CnpjValidator, CpfValidator } from '@hubsd/validators';

import {
  CityInterface,
  ViaCEPResponseInterface,
} from '../../../core/common/common.types';
import { CommonService } from '../../../core/common/common.service';
import { AuthService } from '../../../core/auth/auth.service';
import { UserService } from '../../../core/user/user.service';
import { UserJWTInterface } from '../../../core/user/user.types';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit, OnDestroy {
  public cities: CityInterface[];
  public user: UserJWTInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly service: UserService,
    private readonly common: CommonService,
    private readonly authService: AuthService,
    private readonly toastService: HubsdToastService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}
  ngOnInit(): void {
    this.common.cities$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res) => {
        this.cities = res;
      });

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      personType: ['FÍSICA', [Validators.required]],
      cpf: ['', [CpfValidator.valid()]],
      cnpj: ['', [CnpjValidator.valid()]],
      phone: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      city: [{ disabled: true, value: '' }, [Validators.required]],
      state: [{ disabled: true, value: '' }, [Validators.required]],
      cityId: ['', [Validators.required]],
      number: ['', [Validators.required]],
      street: ['', [Validators.required]],
      complement: ['', []],
      neighborhood: ['', [Validators.required]],
    });

    this.service
      .get()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: UserJWTInterface) => {
        this.user = res;
        let identificationNumber;
        if (res.personType === 'FÍSICA') {
          this.form
            .get('cpf')
            .addValidators([Validators.required, CpfValidator.valid()]);
          this.form.get('cnpj').clearValidators();
          this.form.get('cnpj').updateValueAndValidity();
          identificationNumber = { cpf: res.identificationNumber };
        } else {
          this.form.get('cpf').clearValidators();
          this.form.get('cpf').updateValueAndValidity();
          this.form
            .get('cnpj')
            .addValidators([Validators.required, CnpjValidator.valid()]);
          identificationNumber = { cnpj: res.identificationNumber };
        }

        this.form.patchValue({
          ...res,
          ...identificationNumber,
          ...res.address,
          city: res.address?.city.name,
          state: res.address?.city.state.uf,
        });
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onChangePersonType(resetForm: boolean): void {
    if (resetForm) {
      this.form.get('cpf').reset();
      this.form.get('cnpj').reset();
    }

    if (this.form.get('personType').value === 'FÍSICA') {
      this.form
        .get('cpf')
        .addValidators([Validators.required, CpfValidator.valid()]);
      this.form.get('cnpj').clearValidators();
      this.form.get('cnpj').updateValueAndValidity();
    } else {
      this.form.get('cpf').clearValidators();
      this.form.get('cpf').updateValueAndValidity();
      this.form
        .get('cnpj')
        .addValidators([Validators.required, CnpjValidator.valid()]);
    }
    this.cdr.detectChanges();
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
      phone: this.removeMask(this.form.value.phone),
      cpf: this.form.value.cpf,
      cnpj: this.form.value.cnpj,
      address: {
        cep: this.form.value.cep,
        cityId: this.form.value.cityId,
        street: this.form.value.street,
        number: this.form.value.number,
        complement: this.form.value.complement,
        neighborhood: this.form.value.neighborhood,
      },
    };

    this.service
      .editProfile({ ...formValue, id: this.user.id })
      .pipe(
        takeUntil(this.unsubscribeAll),
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe({
        next: (res) => {
          this.authService.accessToken = res.accessToken;
          this.service.user = res.user;
          this.authService.signInUsingToken();
          this.toastService.handleMessage(res, null, {
            handleRequest: true,
          });
          this.router.navigateByUrl('dashboard');
        },
        error: (error) => {
          this.toastService.handleMessage(
            error,
            'Não foi possível modificar o usuário.',
            { handleRequest: true }
          );
        },
      });
  }
  removeMask(value: string): string {
    return value.replace(/\D/g, '');
  }
}
