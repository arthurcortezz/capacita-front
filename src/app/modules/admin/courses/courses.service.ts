import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Apollo, gql } from "apollo-angular";

import { HubsdTableSortInterface, HubsdTablePaginatorInterface } from "@hubsd/components/table";
import { CourseFilterInterface, CoursesInterface, CoursePaginatedInterface } from "./courses.types";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private readonly apollo: Apollo, private readonly httpClient: HttpClient) {}

  findAllPaginated(
    sort: HubsdTableSortInterface,
    paginator: HubsdTablePaginatorInterface,
    filters?: CourseFilterInterface
  ): Observable<{ data: { courses: CoursePaginatedInterface } }> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query Courses($filters: CourseFiltersInput = {}, $paginator: PaginatorInput = {}, $sort: SortInput = {}) {
          courses(filters: $filters, paginator: $paginator, sort: $sort) {
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

  findAll(): Observable<CoursesInterface[]> {
    return this.httpClient.get<CoursesInterface[]>("@hubsd-api/courses");
  }

  findOne(id: number): Observable<CoursesInterface> {
    return this.httpClient.get<CoursesInterface>(`@hubsd-api/courses/${id}`);
  }

  create(data: CoursesInterface): Observable<{ message: string; course: CoursesInterface }> {
    return this.httpClient.post<{ message: string; course: CoursesInterface }>("@hubsd-api/courses", data);
  }

  update(id: number, data: CoursesInterface): Observable<{ message: string; course: CoursesInterface }> {
    return this.httpClient.put<{ message: string; course: CoursesInterface }>(`@hubsd-api/courses/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`@hubsd-api/courses/${id}`);
  }
}
