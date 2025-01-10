import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

import { CoursesService } from "../../courses.service";
import { HubsdToastService } from "@hubsd/services/toast";
import { HubsdHeaderActionInterface } from "@hubsd/components/header";
import { HubsdConfirmationService } from "@hubsd/services/confirmation";
import { CourseFilterInterface, CoursePaginatedInterface } from "../../courses.types";
import { HubsdTableInterface, HubsdTablePaginatorInterface, HubsdTableSortInterface } from "@hubsd/components/table";

@Component({
  selector: "courses-list",
  templateUrl: "./courses-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class CoursesListComponent implements OnInit, OnDestroy {
  public data: CoursePaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: "Cursos",
    headers: [
      { name: "Nome", key: "name" },
      { name: "Criado em", key: "createdAt" },
      { name: "Modificado em", key: "updatedAt" },
    ],
    content: [
      { type: "field", key: "name" },
      { type: "timestamp", key: "createdAt" },
      { type: "timestamp", key: "updatedAt" },
    ],
    view: true,
    actions: true,
    searchable: true,
    searchableConfig: {
      requestPagination: true,
    },
    selection: true,
    paginator: true,
    paginatorConfig: {
      requestPagination: true,
    },
    sortable: true,
    sortConfig: {
      requestPagination: true,
    },
  };
  public sort: HubsdTableSortInterface;
  public paginator: HubsdTablePaginatorInterface;
  public selection = new SelectionModel<number>(true, []);
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly router: Router,
    private readonly service: CoursesService,
    private readonly toastService: HubsdToastService,
    private readonly confirmationService: HubsdConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: CourseFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { courses: CoursePaginatedInterface } }) => {
        this.data = res.data.courses;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleAction(data: HubsdHeaderActionInterface): void {
    switch (data.action) {
      case "form":
        if (!data.id) {
          this.router.navigateByUrl("cursos/criar");
        } else {
          this.router.navigateByUrl(`cursos/editar/${data.id}`);
        }
        break;
      case "delete":
        const dialogRef = this.confirmationService.open();

        dialogRef.afterClosed().subscribe((res) => {
          if (res === "confirmed") {
            this.service.delete(data.id).subscribe({
              next: (res) => {
                this.getAll();
                this.toastService.handleMessage(res, null, {
                  handleRequest: true,
                });
              },
              error: (error) => {
                this.toastService.handleMessage(error, "Não foi possível remover o curso.", { handleRequest: true });
              },
            });
          }
        });
        break;
      case "observe":
        this.router.navigateByUrl(`cursos/visualizar/${data.id}`);
        break;
    }
  }

  handleSort(event: HubsdTableSortInterface): void {
    this.sort = event;
    this.getAll();
  }

  handlePaginator(event: HubsdTablePaginatorInterface): void {
    this.paginator = event;
    this.getAll();
  }
}
