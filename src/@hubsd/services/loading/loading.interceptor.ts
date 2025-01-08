import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { HubsdLoadingService } from '@hubsd/services/loading/loading.service';

@Injectable()
export class HubsdLoadingInterceptor implements HttpInterceptor {
  handleRequestsAutomatically: boolean;

  constructor(private readonly hubsdLoadingService: HubsdLoadingService) {
    this.hubsdLoadingService.auto$.subscribe((value) => {
      this.handleRequestsAutomatically = value;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.handleRequestsAutomatically) {
      return next.handle(req);
    }

    this.hubsdLoadingService.setLoadingStatus(true, req.url);

    return next.handle(req).pipe(
      finalize(() => {
        this.hubsdLoadingService.setLoadingStatus(false, req.url);
      })
    );
  }
}
