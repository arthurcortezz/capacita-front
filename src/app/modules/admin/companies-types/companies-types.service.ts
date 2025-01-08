import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

import {
  HubsdTableSortInterface,
  HubsdTablePaginatorInterface,
} from '@hubsd/components/table';
import {
  CompanyTypeFilterInterface,
  CompanyTypeInterface,
} from './companies-types.types';
import { CompanyPaginatedInterface } from '../companies/companies.types';

@Injectable({
  providedIn: 'root',
})
export class CompaniesTypesService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: CompanyTypeFilterInterface
  ): Observable<{ data: { companiesType: CompanyPaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query CompaniesTypes(
          $filters: CompanyTypeFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          companiesType(filters: $filters, paginator: $paginator, sort: $sort) {
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

  findAll(): Observable<CompanyTypeInterface[]> {
    return this.httpClient.get<CompanyTypeInterface[]>(
      '@hubsd-api/companies-type'
    );
  }

  findOne(id: number): Observable<CompanyTypeInterface> {
    return this.httpClient.get<CompanyTypeInterface>(
      `@hubsd-api/companies-type/${id}`
    );
  }

  create(
    data: CompanyTypeInterface
  ): Observable<{ message: string; companyType: CompanyTypeInterface }> {
    return this.httpClient.post<{
      message: string;
      companyType: CompanyTypeInterface;
    }>('@hubsd-api/companies-type', data);
  }

  update(
    id: number,
    data: CompanyTypeInterface
  ): Observable<{ message: string; companyType: CompanyTypeInterface }> {
    return this.httpClient.put<{
      message: string;
      companyType: CompanyTypeInterface;
    }>(`@hubsd-api/companies-type/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/companies-type/${id}`
    );
  }
}
