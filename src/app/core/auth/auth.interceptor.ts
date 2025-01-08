import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { AuthUtils } from './auth.utils';
import { AuthService } from './auth.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    if (req.url.includes('@hubsd-api')) {
      req = req.clone({
        url: req.url.replace('@hubsd-api', environment.urlApi),
      });
    }

    if (
      this.authService.accessToken &&
      !AuthUtils.isTokenExpired(this.authService.accessToken)
    ) {
      req = req.clone({
        setHeaders: this.getOptions(req),
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // this.authService.signOut();
          //location.reload();
        }

        return throwError(error);
      })
    );
  }

  getOptions<T>(req: HttpRequest<T>): { [header: string]: string | string[] } {
    const isFormData = req.body instanceof FormData;
    if (isFormData) {
      return {
        Authorization: `Bearer ${this.authService.accessToken}`,
      };
    }

    return {
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.authService.accessToken}`,
    };
  }
}
