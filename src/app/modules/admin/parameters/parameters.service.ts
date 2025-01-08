import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ParameterFilterInterface,
  ParameterInterface,
} from './parameters.types';
import { Apollo, gql } from 'apollo-angular';
import {
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';

@Injectable({
  providedIn: 'root',
})
export class ParametersService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: ParameterFilterInterface
  ) {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Parameters(
          $filters: ParameterFiltersInput = {}
          $sort: SortInput = {}
          $paginator: PaginatorInput = {}
        ) {
          parameters(filters: $filters, sort: $sort, paginator: $paginator) {
            count
            rows {
              id
              key
              description
              value
            }
          }
        }
      `,
      variables: { filters, sort, paginator },
    }).valueChanges;
  }

  findAll(): Observable<ParameterInterface[]> {
    return this.httpClient.get<ParameterInterface[]>('@hubsd-api/parameters');
  }

  findOne(id: number): Observable<ParameterInterface> {
    return this.httpClient.get<ParameterInterface>(
      `@hubsd-api/parameters/${id}`
    );
  }

  create(
    data: ParameterInterface
  ): Observable<{ message: string; parameter: ParameterInterface }> {
    return this.httpClient.post<{
      message: string;
      parameter: ParameterInterface;
    }>('@hubsd-api/parameters', data);
  }

  update(
    id: number,
    data: ParameterInterface
  ): Observable<{ message: string; parameter: ParameterInterface }> {
    return this.httpClient.put<{
      message: string;
      parameter: ParameterInterface;
    }>(`@hubsd-api/parameters/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/parameters/${id}`
    );
  }
}
