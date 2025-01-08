import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, ReplaySubject } from 'rxjs';
import { CityInterface } from './common.types';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _cities: ReplaySubject<CityInterface[]> = new ReplaySubject<CityInterface[]>(1);

  constructor(private httpClient: HttpClient) {}

  get cities$(): Observable<CityInterface[]> {
    return this._cities.asObservable();
  }

  findAllCities(): Observable<any> {
    return this.httpClient.get<any>('@hubsd-api/cities').pipe(
      tap((response) => {
        this._cities.next(response);
      })
    );
  }
}
