import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { UserJWTInterface } from './user.types';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: ReplaySubject<UserJWTInterface> =
    new ReplaySubject<UserJWTInterface>(1);

  constructor(private httpClient: HttpClient) {}

  set user(value: UserJWTInterface) {
    this._user.next(value);
  }

  get user$(): Observable<UserJWTInterface> {
    return this._user.asObservable();
  }

  get(): Observable<UserJWTInterface> {
    return this.httpClient
      .get<UserJWTInterface>('@hubsd-api/authentication/profile')
      .pipe(
        tap((response) => {
          this._user.next(response);
        })
      );
  }

  editProfile(data: UserJWTInterface): Observable<any> {
    return this.httpClient.post<UserJWTInterface>(
      '@hubsd-api/authentication/edit-profile',
      data
    );
  }

  editPassword(data: {
    password: string;
    newPassword: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.httpClient.post<UserJWTInterface>(
      '@hubsd-api/authentication/edit-password',
      data
    );
  }

  getInfoByCEP(cep: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.viaCepUrl}/${cep}/json`);
  }

  verifyPlans(): Observable<any> {
    return this.httpClient.get<any>('@hubsd-api/authentication/verify-plans');
  }
}
