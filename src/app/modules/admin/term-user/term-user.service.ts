import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TermUserInterface } from './term-user.types';

@Injectable({
  providedIn: 'root',
})
export class TermUserService {
  constructor(private readonly httpClient: HttpClient) {}

  find(): Observable<TermUserInterface> {
    return this.httpClient.get<TermUserInterface>('@hubsd-api/terms-service');
  }

  save(
    data: TermUserInterface
  ): Observable<{ message: string; termUser: TermUserInterface }> {
    return this.httpClient.put<{
      message: string;
      termUser: TermUserInterface;
    }>('@hubsd-api/terms-service', data);
  }
}
