import { Route } from '@angular/router';
import { AuthResetPasswordComponent } from './reset-password.component';

export const authResetPasswordRoutes: Route[] = [
  {
    path: ':token',
    component: AuthResetPasswordComponent,
  },
];
