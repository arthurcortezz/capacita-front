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

import { UserFilterInterface, UserPaginatedInterface } from '../../users.types';
import { UsersService } from '../../users.service';

@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UsersListComponent implements OnInit, OnDestroy {
  public data: UserPaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Usuários',
    headers: [
      { name: 'Nome', key: 'name' },
      { name: 'E-mail', key: 'email' },
      { name: 'Perfil de Acesso', key: 'role.name' },
      { name: 'Criado em', key: 'createdAt' },
      { name: 'Modificado em', key: 'updatedAt' },
    ],
    content: [
      { type: 'field', key: 'name' },
      { type: 'field', key: 'email' },
      { type: 'field', key: 'role.name' },
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
  private readonly unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private readonly confirmationService: HubsdConfirmationService,
    private readonly router: Router,
    private readonly toastService: HubsdToastService,
    private readonly service: UsersService
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: UserFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { users: UserPaginatedInterface } }) => {
        this.data = res.data.users;
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
          this.router.navigateByUrl('usuarios/criar');
        } else {
          this.router.navigateByUrl(`usuarios/editar/${data.id}`);
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
                  'Não foi possível remover o usuário.',
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
