import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';


import {
  HubsdTableSortInterface,
  HubsdTablePaginatorInterface,
} from '@hubsd/components/table';
import { ActionPaginatedInterface, ActionInterface, ActionFilterInterface } from './actions.types';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: ActionFilterInterface,
  ): Observable<{ data: { actions: ActionPaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Actions(
          $filters: ActionFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          actions(filters: $filters, paginator: $paginator, sort: $sort) {
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

  findAll(): Observable<ActionInterface[]> {
    return this.httpClient.get<ActionInterface[]>('@hubsd-api/actions');
  }

  findOne(id: number): Observable<ActionInterface> {
    return this.httpClient.get<ActionInterface>(`@hubsd-api/actions/${id}`);
  }

  create(
    data: ActionInterface
  ): Observable<{ message: string; action: ActionInterface }> {
    return this.httpClient.post<{ message: string; action: ActionInterface }>(
      '@hubsd-api/actions',
      data
    );
  }

  update(
    id: number,
    data: ActionInterface
  ): Observable<{ message: string; action: ActionInterface }> {
    return this.httpClient.put<{ message: string; action: ActionInterface }>(
      `@hubsd-api/actions/${id}`,
      data
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/actions/${id}`
    );
  }
}
