import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil } from 'rxjs';

import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import { HubsdToastService } from '@hubsd/services/toast';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';

import { MenuFilterInterface, MenuPaginatedInterface } from '../../menus.types';
import { MenusService } from '../../menus.service';

@Component({
  selector: 'menus-list',
  templateUrl: './menus-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MenusListComponent implements OnInit, OnDestroy {
  public data: MenuPaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Menus',
    headers: [
      { name: 'Nome', key: 'name' },
      { name: 'Ícone', key: 'icon' },
      { name: 'Rota', key: 'route' },
      { name: 'Chave do Menu', key: 'menuKey' },
      { name: 'Criado em', key: 'createdAt' },
      { name: 'Modificado em', key: 'updatedAt' },
    ],
    content: [
      { type: 'field', key: 'name' },
      { type: 'field', key: 'icon' },
      { type: 'field', key: 'route' },
      { type: 'field', key: 'menuKey' },
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
    private readonly confirmationService: HubsdConfirmationService,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly service: MenusService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: MenuFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { menus: MenuPaginatedInterface } }) => {
        this.data = res.data.menus;
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
          this.router.navigateByUrl('menus/criar');
        } else {
          this.router.navigateByUrl(`menus/editar/${data.id}`);
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
                  'Não foi possível remover o menu.',
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
