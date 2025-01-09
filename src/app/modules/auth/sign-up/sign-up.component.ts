import { finalize } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NgForm, Validators, UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";

import { CpfValidator, PasswordValidator } from "@hubsd/validators";
import { HubsdToastService } from "@hubsd/services/toast";
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styles: [
    `
      .mdc-text-field {
        .mdc-floating-label {
          .mat-mdc-form-field-required-marker {
            color: #0b4d1c;
          }
        }
      }
      @media (prefers-color-scheme: dark) {
        .mdc-text-field {
          .mdc-floating-label {
            .mat-mdc-form-field-required-marker {
              color: #0b4d1c;
            }
          }
        }
      }
      .mdc-checkbox__background {
        border: 2px solid #0b4d1c !important;
      }
      .mdc-form-field {
        padding-right: 0px !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild("signUpNgForm") signUpNgForm: NgForm;

  public hidePassword = true;
  public hideConfirmPassword = true;

  public form: UntypedFormGroup;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly toastService: HubsdToastService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      password: ["", [Validators.required, PasswordValidator.valid()]],
      confirmPassword: ["", [Validators.required, PasswordValidator.valid()]],
      email: ["", [Validators.required, Validators.email]],
      cpf: ["", [Validators.required, CpfValidator.valid()]],
      phone: ["", [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]],
    });
  }

  signUp(): void {
    this.form.disable();
    const formValue = {
      ...this.form.value,
      cpf: this.removeMask(this.form.value.cpf),
      phone: this.removeMask(this.form.value.phone),
    };
    this.authService
      .signUp(formValue)
      .pipe(
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe({
        next: () => {
          const redirectURL = this.activatedRoute.snapshot.queryParamMap.get("redirectURL") || "/login";
          this.router.navigateByUrl(redirectURL);
          this.toastService.handleMessage("Realize o seu login!", null, { handleRequest: true });
        },

        error: (error) => {
          this.toastService.handleMessage(error, "Não foi possível criar a conta.", { handleRequest: true });
        },
      });
  }

  clickBack(): void {
    this.router.navigateByUrl("/login");
  }
  removeMask(value: string): string {
    return value.replace(/\D/g, "");
  }
}
