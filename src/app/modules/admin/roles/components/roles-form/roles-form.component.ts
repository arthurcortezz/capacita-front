import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';

import { HubsdToastService } from '@hubsd/services/toast';

import { RolesService } from '../../roles.service';
import { RoleInterface } from '../../roles.types';

@Component({
  selector: 'roles-form',
  templateUrl: './roles-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RolesFormComponent implements OnInit, OnDestroy {
  public id: number;
  public role: RoleInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly service: RolesService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        void this.service.findOne(this.id).pipe(takeUntil(this.unsubscribeAll)).subscribe((res: RoleInterface): void => {
          this.role = res;
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
      this.service.update(this.id, { ...this.form.value, id: this.id })
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null,{ handleRequest: true });
            this.router.navigateByUrl('perfis-de-acessos');
          },
          error: (error) => {
            this.toastService.handleMessage(error, 'Não foi possível modificar o perfil de acesso.',{ handleRequest: true });
          },
        });
    } else {
      this.service.create(this.form.value)
        .pipe(
          takeUntil(this.unsubscribeAll),
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null,{ handleRequest: true });
            this.router.navigateByUrl('perfis-de-acessos');
          },
          error: (error) => {
            this.toastService.handleMessage(error, 'Não foi possível criar o perfil de acesso.',{ handleRequest: true });
          },
        });
    }
  }
}
