import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ParameterFilterInterface,
  ParameterPaginatedInterface,
} from '../../parameters.types';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil } from 'rxjs';
import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import { ParametersService } from '../../parameters.service';
import { HubsdToastService } from '@hubsd/services/toast';
import { Router } from '@angular/router';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';

@Component({
  selector: 'parameters-list',
  templateUrl: './parameters-list.component.html',
})
export class ParametersListComponent implements OnInit, OnDestroy {
  public data: ParameterPaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Parâmetros de sistema',
    headers: [
      { name: 'Chave', key: 'key' },
      { name: 'Valor', key: 'value' },
      { name: 'Descrição', key: 'description' },
    ],
    content: [
      { type: 'field', key: 'key' },
      { type: 'field', key: 'value' },
      { type: 'field', key: 'description' },
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
    private readonly confirmationService: HubsdConfirmationService,
    private readonly service: ParametersService,
    private readonly toastService: HubsdToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: ParameterFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(
        (res: { data: { parameters: ParameterPaginatedInterface } }) => {
          this.data = res.data.parameters;
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSort(event: HubsdTableSortInterface): void {
    this.sort = event;
    this.getAll();
  }

  handlePaginator(event: HubsdTablePaginatorInterface): void {
    this.paginator = event;
    this.getAll();
  }

  handleAction(data: HubsdHeaderActionInterface): void {
    switch (data.action) {
      case 'form':
        if (!data.id) {
          this.router.navigateByUrl('parametros-de-sistema/criar');
        } else {
          this.router.navigateByUrl(`parametros-de-sistema/editar/${data.id}`);
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
                  'Não foi possível remover o parâmetro de sistema.',
                  { handleRequest: true }
                );
              },
            });
          }
        });
        break;
    }
  }
}
