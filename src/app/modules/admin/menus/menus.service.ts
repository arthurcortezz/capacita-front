import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

import {
  MenuFilterInterface,
  MenuInterface,
  MenuPaginatedInterface,
} from './menus.types';
import {
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: MenuFilterInterface
  ): Observable<{ data: { menus: MenuPaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Menus(
          $filters: MenuFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          menus(filters: $filters, paginator: $paginator, sort: $sort) {
            rows {
              id
              name
              route
              menuKey
              icon
              createdAt
              updatedAt
            }
            count
          }
        }
      `,
      variables: { filters, sort, paginator },
    }).valueChanges;
  }

  findAll(): Observable<MenuInterface[]> {
    return this.httpClient.get<MenuInterface[]>('@hubsd-api/menus');
  }

  findOne(id: number): Observable<MenuInterface> {
    return this.httpClient.get<MenuInterface>(`@hubsd-api/menus/${id}`);
  }

  create(
    data: MenuInterface
  ): Observable<{ message: string; menu: MenuInterface }> {
    return this.httpClient.post<{ message: string; menu: MenuInterface }>(
      '@hubsd-api/menus',
      data
    );
  }

  update(
    id: number,
    data: MenuInterface
  ): Observable<{ message: string; menu: MenuInterface }> {
    return this.httpClient.put<{ message: string; menu: MenuInterface }>(
      `@hubsd-api/menus/${id}`,
      data
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/menus/${id}`
    );
  }
}
