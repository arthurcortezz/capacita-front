import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import {
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import {
  CompanyFilterInterface,
  CompanyInterface,
  CompanyPaginatedInterface,
} from './companies.types';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(
    private readonly apollo: Apollo,
    private readonly httpClient: HttpClient
  ) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: CompanyFilterInterface
  ): Observable<{ data: { companies: CompanyPaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Companies(
          $filters: CompanyFiltersInput = {}
          $paginator: PaginatorInput = {}
          $sort: SortInput = {}
        ) {
          companies(filters: $filters, paginator: $paginator, sort: $sort) {
            rows {
              id
              name
              socialReason
              cnpj
              users {
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

  findAll(): Observable<CompanyInterface[]> {
    return this.httpClient.get<CompanyInterface[]>('@hubsd-api/companies');
  }

  findOne(id: number): Observable<CompanyInterface> {
    return this.httpClient.get<CompanyInterface>(`@hubsd-api/companies/${id}`);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(
      `@hubsd-api/companies/${id}`
    );
  }

  create(company: CompanyInterface): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(
      '@hubsd-api/companies',
      company
    );
  }

  update(company: CompanyInterface): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(
      `@hubsd-api/companies/${company.id}`,
      company
    );
  }
  getInfoByCEP(cep: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.viaCepUrl}/${cep}/json`);
  }
}
