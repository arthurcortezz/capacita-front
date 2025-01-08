import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { HubsdToastService } from '@hubsd/services/toast';
import { CnpjValidator, CpfValidator } from '@hubsd/validators';

import { ConsultantInterface } from '../../consultants.types';
import { ConsultantsService } from '../../consultants.service';
import { RoleInterface } from '../../../roles/roles.types';
import { RolesService } from '../../../roles/roles.service';
import { CompanyInterface } from '../../../companies/companies.types';
import { CompaniesService } from '../../../companies/companies.service';
import { UserService } from '../../../../../core/user/user.service';

@Component({
  selector: 'consultants-form',
  templateUrl: './consultants-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ConsultantsFormComponent implements OnInit, OnDestroy {
  public id: number;
  public consultant: ConsultantInterface;
  public companies: CompanyInterface[];
  public roles: RoleInterface[];
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly service: ConsultantsService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly toastService: HubsdToastService,
    private readonly companiesService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      personType: ['FÍSICA', [Validators.required]],
      cpf: ['', [Validators.required, CpfValidator.valid()]],
      cnpj: ['', [CnpjValidator.valid()]],
      phone: ['', [Validators.required]],
      roleId: [3, [Validators.required]],
      companyId: ['', [Validators.required]],
      hasAgreedTermService: [true, []],
    });

    this.userService.user$.subscribe((user) => {
        this.form.get('roleId').disable();
        if (user.company?.id) {
        this.form.patchValue({ companyId: user.company.id });
        this.companies = [user.company];
        this.form.get('companyId').disable();
      } else {
        this.companiesService
          .findAll()
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res) => {
            this.companies = res;
          });
      }
    });
    if (this.id)
      this.service
        .findOne(this.id)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe((res: ConsultantInterface) => {
          const identificationNumber =
            res.personType === 'FÍSICA'
              ? { cpf: res.identificationNumber }
              : { cnpj: res.identificationNumber };
          this.form.patchValue({
            ...res,
            ...identificationNumber,
          });
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
      phone: this.removeMask(this.form.value.phone),
      cpf: this.form.value.cpf,
      cnpj: this.form.value.cnpj,
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
            this.router.navigateByUrl('consultores');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o usuário.',
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
            this.router.navigateByUrl('consultores');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar o consultor.',
              { handleRequest: true }
            );
          },
        });
  }

  removeMask(value: string): string {
    return value.replace(/\D/g, '');
  }
}
