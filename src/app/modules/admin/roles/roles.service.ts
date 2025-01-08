import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

import {
  HubsdTableSortInterface,
  HubsdTablePaginatorInterface,
} from '@hubsd/components/table';
import {
  RoleFilterInterface,
  RoleInterface,
  RolePaginatedInterface,
} from './roles.types';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: RoleFilterInterface
  ): Observable<{ data: { roles: RolePaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Roles(
          $filters: RoleFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          roles(filters: $filters, paginator: $paginator, sort: $sort) {
            rows {
              id
              name
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

  findAll(): Observable<RoleInterface[]> {
    return this.httpClient.get<RoleInterface[]>('@hubsd-api/roles');
  }

  findOne(id: number): Observable<RoleInterface> {
    return this.httpClient.get<RoleInterface>(`@hubsd-api/roles/${id}`);
  }

  create(
    data: RoleInterface
  ): Observable<{ message: string; role: RoleInterface }> {
    return this.httpClient.post<{ message: string; role: RoleInterface }>(
      '@hubsd-api/roles',
      data
    );
  }

  update(
    id: number,
    data: RoleInterface
  ): Observable<{ message: string; role: RoleInterface }> {
    return this.httpClient.put<{ message: string; role: RoleInterface }>(
      `@hubsd-api/roles/${id}`,
      data
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/roles/${id}`
    );
  }
}
