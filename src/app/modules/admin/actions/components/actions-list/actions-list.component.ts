import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { HubsdToastService } from '@hubsd/services/toast';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionsService } from '../../actions.service';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';
import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import {
  ActionFilterInterface,
  ActionPaginatedInterface,
} from '../../actions.types';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';

@Component({
  selector: 'actions-list',
  templateUrl: './actions-list.component.html',
})
export class ActionsListComponent implements OnInit, OnDestroy {
  public data: ActionPaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Ações',
    headers: [
      { name: 'Nome', key: 'name' },
      { name: 'Criado em', key: 'createdAt' },
      { name: 'Modificado em', key: 'updatedAt' },
    ],
    content: [
      { type: 'field', key: 'name' },
      { type: 'timestamp', key: 'createdAt' },
      { type: 'timestamp', key: 'updatedAt' },
    ],
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
    private readonly service: ActionsService,
    private readonly confirmationService: HubsdConfirmationService,
    private readonly toastService: HubsdToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: ActionFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { actions: ActionPaginatedInterface } }) => {
        this.data = res.data.actions;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleAction(data: HubsdHeaderActionInterface): void {
    switch (data.action) {
      case 'form':
        if (!data.id) {
          this.router.navigateByUrl('acoes/criar');
        } else {
          this.router.navigateByUrl(`acoes/editar/${data.id}`);
        }
        break;
      case 'delete':
        const dialogRef = this.confirmationService.open();

        dialogRef.afterClosed().subscribe((res) => {
          if (res === 'confirmed') {
            this.service.delete(data.id).subscribe({
              next: (res) => {
                this.getAll();
                this.toastService.handleMessage(res, null, {
                  handleRequest: true,
                });
              },
              error: (error) => {
                this.toastService.handleMessage(
                  error,
                  'Não foi possível remover a ação.',
                  { handleRequest: true }
                );
              },
            });
          }
        });
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
