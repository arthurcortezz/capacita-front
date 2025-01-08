import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, Observable, of, switchMap, throwError } from 'rxjs';

import { HUBSD_MOCK_API_DEFAULT_DELAY } from '@hubsd/mock-api/mock-api.constants';
import { HubsdMockApiService } from '@hubsd/mock-api/mock-api.service';
import { AuthService } from '../../app/core/auth/auth.service';
import { AuthUtils } from '../../app/core/auth/auth.utils';

@Injectable({
    providedIn: 'root'
})
export class HubsdMockApiInterceptor implements HttpInterceptor {
  constructor(
    @Inject(HUBSD_MOCK_API_DEFAULT_DELAY)
    private readonly defaultDelay: number,

    private readonly authService: AuthService,

    private readonly service: HubsdMockApiService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {
      handler,
      urlParams
    } = this.service.findHandler(request.method.toUpperCase(), request.url.replace('@hubsd-api', 'api'));

    if (
      this.authService.accessToken &&
      !AuthUtils.isTokenExpired(this.authService.accessToken)
    ) {
      request = request.clone({
        setHeaders: this.getOptions(request),
      });
    }

    if (!handler) {
      return next.handle(request);
    }

    handler.request = request;
    handler.urlParams = urlParams;

    return handler.response.pipe(
      delay(handler.delay ?? this.defaultDelay ?? 0),
      switchMap((response) => {
        if (!response) {
          response = new HttpErrorResponse({
            error     : 'NOT FOUND',
            status    : 404,
            statusText: 'NOT FOUND'
          });

          return throwError(response);
        }

        const data = {
          status: response[0],
          body  : response[1]
        };

        if (data.status >= 200 && data.status < 300) {
          response = new HttpResponse({
            body      : data.body,
            status    : data.status,
            statusText: 'OK'
          });

          return of(response);
        }

        response = new HttpErrorResponse({
          error     : data.body.error,
          status    : data.status,
          statusText: 'ERROR'
        });

        return throwError(response);
      })
    );
  }

  getOptions(req: HttpRequest<any>): any {
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
