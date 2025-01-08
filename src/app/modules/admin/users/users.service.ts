import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

import {
  UserFilterInterface,
  UserInterface,
  UserPaginatedInterface,
} from './users.types';
import {
  HubsdTableSortInterface,
  HubsdTablePaginatorInterface,
} from '@hubsd/components/table';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: UserFilterInterface
  ): Observable<{ data: { users: UserPaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Users(
          $filters: UserFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          users(filters: $filters, paginator: $paginator, sort: $sort) {
            rows {
              id
              name
              email
              role {
                id
                name
              }
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

  findAll(): Observable<UserInterface[]> {
    return this.httpClient.get<UserInterface[]>('@hubsd-api/users');
  }

  findOne(id: number): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(`@hubsd-api/users/${id}`);
  }

  create(
    data: UserInterface
  ): Observable<{ message: string; user: UserInterface }> {
    return this.httpClient.post<{ message: string; user: UserInterface }>(
      '@hubsd-api/users',
      data
    );
  }

  update(
    id: number,
    data: UserInterface
  ): Observable<{ message: string; user: UserInterface }> {
    return this.httpClient.put<{ message: string; user: UserInterface }>(
      `@hubsd-api/users/${id}`,
      data
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/users/${id}`
    );
  }
}
