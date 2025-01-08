import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

import {
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import {
  ConsultantFilterInterface,
  ConsultantInterface,
  ConsultantPaginatedInterface,
} from './consultants.types';

@Injectable({
  providedIn: 'root',
})
export class ConsultantsService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: ConsultantFilterInterface
  ): Observable<{ data: { consultants: ConsultantPaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Consultants(
          $filters: UserFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          consultants(filters: $filters, paginator: $paginator, sort: $sort) {
            rows {
              id
              name
              email
              company {
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

  findOne(id: number): Observable<ConsultantInterface> {
    return this.httpClient.get<ConsultantInterface>(`@hubsd-api/users/${id}`);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/users/${id}`
    );
  }
  create(user: ConsultantInterface): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>('@hubsd-api/users', user);
  }
  update(data: ConsultantInterface): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(
      `@hubsd-api/users/${data.id}`,
      data
    );
  }
}
