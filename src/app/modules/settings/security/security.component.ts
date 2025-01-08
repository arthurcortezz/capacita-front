import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { HubsdToastService } from '@hubsd/services/toast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';

import { UserService } from '../../../core/user/user.service';
import { UserJWTInterface } from '../../../core/user/user.types';

@Component({
  selector: 'security',
  templateUrl: './security.component.html',
})
export class SecurityComponent implements OnInit, OnDestroy {
  public id: number;
  public user: UserJWTInterface;
  public form: UntypedFormGroup;
  private readonly unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly service: UserService,
    private readonly toastService: HubsdToastService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      oldPass: ['', [Validators.required]],
      newPass: ['', [Validators.required]],
      confirmNewPass: ['', [Validators.required]],
    });

    this.service.get().subscribe((res) => {
      this.user = res;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSaveOrUpdate(): void {
    this.form.disable();
    this.service
      .editPassword({
        password: this.form.value.oldPass,
        newPassword: this.form.value.newPass,
        confirmPassword: this.form.value.confirmNewPass,
      })
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
          this.router.navigateByUrl('dashboard');
        },
        error: (error) => {
          this.toastService.handleMessage(
            error,
            'Não foi possível modificar a senha.',
            { handleRequest: true }
          );
        },
      });
  }
}
