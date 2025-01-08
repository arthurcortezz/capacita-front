import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { HubsdConfirmationService } from '@hubsd/services/confirmation';
import {
  HubsdTableInterface,
  HubsdTablePaginatorInterface,
  HubsdTableSortInterface,
} from '@hubsd/components/table';
import { HubsdToastService } from '@hubsd/services/toast';
import { HubsdHeaderActionInterface } from '@hubsd/components/header';

import { CompaniesService } from '../../companies.service';
import { CompanyPaginatedInterface, CompanyFilterInterface } from '../../companies.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'companies-list',
  templateUrl: './companies-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class CompaniesListComponent implements OnInit {
  public data: CompanyPaginatedInterface = null;
  public config: HubsdTableInterface = {
    title: 'Empresas',
    headers: [
      { name: 'Nome', key: 'name' },
      { name: 'Razão Social', key: 'socialReason' },
      { name: 'CNPJ', key: 'cnpj' },
      { name: 'Código de convite', key: 'inviteCode' },
      { name: 'Usuários', key: 'users' },
      // { name: 'Administrador', key: 'admin.name' },
      { name: 'Criado em', key: 'createdAt' },
      { name: 'Modificado em', key: 'updatedAt' },
    ],
    content: [
      { type: 'field', key: 'name' },
      { type: 'field', key: 'socialReason' },
      { type: 'identificationNumber', key: 'cnpj' },
      { type: 'field', key: 'inviteCode' },
      { type: 'length', key: 'users' },
      // { type: 'field', key: 'admin.name' },
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
    private readonly service: CompaniesService,
    private readonly confirmationService: HubsdConfirmationService,
    private readonly toastService: HubsdToastService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(filters?: CompanyFilterInterface): void {
    this.service
      .findAllPaginated(this.sort, this.paginator, filters)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: { data: { companies: CompanyPaginatedInterface } }) => {
        this.data = res.data.companies;
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
          this.router.navigateByUrl('empresas/criar');
        } else {
          this.router.navigateByUrl(`empresas/editar/${data.id}`);
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
