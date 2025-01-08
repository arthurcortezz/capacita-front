import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import { HubsdToastService } from '@hubsd/services/toast';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';

import { RoleFilterInterface, RolePaginatedInterface } from '../../roles.types';
import { RolesService } from '../../roles.service';

@Component({
  selector: 'roles-list',
  templateUrl: './roles-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class RolesListComponent implements OnInit, OnDestroy {
  public data: RolePaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Perfis de Acessos',
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
    private readonly confirmationService: HubsdConfirmationService,
    private readonly service: RolesService,
    private readonly toastService: HubsdToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: RoleFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { roles: RolePaginatedInterface } }) => {
        this.data = res.data.roles;
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
          this.router.navigateByUrl('perfis-de-acessos/criar');
        } else {
          this.router.navigateByUrl(`perfis-de-acessos/editar/${data.id}`);
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
                  'Não foi possível remover o perfil de acesso.',
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
