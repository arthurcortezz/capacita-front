import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';

import { HubsdToastService } from '@hubsd/services/toast';
import {
  CnpjValidator,
  CpfValidator,
  HubsdValidators,
} from '@hubsd/validators';

import { UserInterface } from '../../users.types';
import { UsersService } from '../../users.service';
import { RoleInterface } from '../../../roles/roles.types';
import { RolesService } from '../../../roles/roles.service';
import { CompanyInterface } from '../../../companies/companies.types';
import { CompaniesService } from '../../../companies/companies.service';

@Component({
  selector: 'users-form',
  templateUrl: './users-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UsersFormComponent implements OnInit, OnDestroy {
  public id: number;
  public user: UserInterface;
  public companies: CompanyInterface[];
  public roles: RoleInterface[];
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly rolesService: RolesService,
    private readonly companiesService: CompaniesService,
    private readonly service: UsersService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required]],
        personType: ['FÍSICA', [Validators.required]],
        cpf: ['', [Validators.required, CpfValidator.valid()]],
        cnpj: ['', [CnpjValidator.valid()]],
        phone: ['', [Validators.required]],
        password: ['', []],
        confirmPassword: ['', []],
        roleId: [null, [Validators.required]],
        companyId: ['', []],
        hasAgreedTermService: [true, []],
      },
      {
        validators: HubsdValidators.mustMatch('password', 'confirmPassword'),
      }
    );

    void this.rolesService
      .findAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: RoleInterface[]): void => {
        this.roles = res;
      });

    void this.companiesService
      .findAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: CompanyInterface[]): void => {
        this.companies = res;
      });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: UserInterface): void => {
            this.user = res;

            const identificationNumber =
              res.personType === 'FÍSICA'
                ? { cpf: res.identificationNumber }
                : { cnpj: res.identificationNumber };
            this.form.patchValue({ ...res, ...identificationNumber });

            this.onChangePersonType();
          });
      } else {
        this.form.get('password').addValidators([Validators.required]);
        this.form.get('confirmPassword').addValidators([Validators.required]);

        this.onChangePersonType();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onChangePersonType(resetForm?: boolean): void {
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
  }

  handleSaveOrUpdate(): void {
    this.form.disable();
    const formValue = {
      ...this.form.value,
      cpf: this.removeMask(this.form.value.cpf),
      cnpj: this.removeMask(this.form.value.cnpj),
      phone: this.removeMask(this.form.value.phone),
    };

    if (this.id) {
      this.service
        .update(this.id, { ...formValue, id: this.id })
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, { handleRequest: true });
            this.router.navigateByUrl('usuarios');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o usuário.',
              { handleRequest: true }
            );
          },
        });
    } else {
      this.service
        .create(formValue)
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, { handleRequest: true });
            this.router.navigateByUrl('usuarios');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar o usuário.',
              { handleRequest: true }
            );
          },
        });
    }
  }

  removeMask(value: string): string {
    return value.replace(/\D/g, '');
  }
}
