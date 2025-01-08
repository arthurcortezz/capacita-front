import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { HubsdValidators } from '@hubsd/validators';
import { hubsdAnimations } from '@hubsd/animations';
import { HubsdToastService } from '@hubsd/services/toast';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  animations: hubsdAnimations,
  styles: [
    `
      .mdc-checkbox__background {
        border: 2px solid white !important;
      }
      .mdc-checkbox
        .mdc-checkbox__native-control[disabled]:checked
        ~ .mdc-checkbox__background {
        background-color: white !important;
        color: none !important;
        svg {
          color: #004c98 !important;
        }
      }

      .mat-mdc-progress-bar {
        border: 1px solid white !important;
        padding: 2px 0 2px 0 !important;
        background-color: white !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AuthResetPasswordComponent implements OnInit {
  public resetPasswordForm: UntypedFormGroup;
  public token: string;

  public isVisible = false;
  public confirmIsVisible = false;
  public progressPercentage = 0;
  public spaceValid: boolean = false;
  public numberValid: boolean = false;
  public symbolValid: boolean = false;
  public lengthValid: boolean = false;
  public uppercaseValid: boolean = false;
  public lowercaseValid: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: HubsdValidators.mustMatch('password', 'confirmPassword'),
      }
    );

    this.activatedRoute.paramMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  onPasswordChange(): void {
    this.numberValid = /\d/.test(this.resetPasswordForm.get('password').value);
    this.symbolValid = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(
      this.resetPasswordForm.get('password').value
    );
    this.uppercaseValid = /[A-Z]/.test(
      this.resetPasswordForm.get('password').value
    );
    this.lowercaseValid = /[a-z]/.test(
      this.resetPasswordForm.get('password').value
    );
    this.lengthValid = /^.{8,32}$/.test(
      this.resetPasswordForm.get('password').value
    );
    this.spaceValid = /^\S{1,}$/.test(
      this.resetPasswordForm.get('password').value
    );
    const strongLength = [
      this.numberValid,
      this.symbolValid,
      this.uppercaseValid,
      this.lowercaseValid,
      this.lengthValid,
      this.spaceValid,
    ].filter(Boolean).length;

    this.progressPercentage = (strongLength / 6) * 100;
  }

  handleRequest(): void {
    this.resetPasswordForm.disable();

    this.authService
      .resetPassword(this.token, this.resetPasswordForm.value)
      .pipe(
        finalize(() => {
          this.resetPasswordForm.enable();
        })
      )
      .subscribe({
        next: (res) => {
          this.toastService.handleMessage(res, null, { handleRequest: true });
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          this.toastService.handleMessage(
            error,
            'Não foi possível fazer login.',
            { handleRequest: true }
          );
        },
      });
  }
  clickBack(route: string): void {
    this.router.navigateByUrl(`/${route}`);
  }
}
