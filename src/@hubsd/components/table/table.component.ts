import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { HubsdTableInterface } from './table.types';
import { UserService } from '../../../app/core/user/user.service';

@Component({
  selector: 'hubsd-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class HubsdTableComponent implements OnInit {
  @Input() config: HubsdTableInterface;
  @Input() data: any[] & { rows: any[]; count: number };
  @Input() selection = new SelectionModel<number>(true, []);
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() filtered: EventEmitter<any> = new EventEmitter();
  @Output() sortabled: EventEmitter<any> = new EventEmitter();
  @Output() paginated: EventEmitter<any> = new EventEmitter();
  @Output() actionListener: EventEmitter<any> = new EventEmitter();

  public defaultPageSize: number = 5;
  public pageIndex: number;
  public pageSize: number;
  public dataSource: any[] = null;
  public dataSourceLength: number;

  public filterValue: string = '';
  public selectedStatus: string = '';

  public listable: boolean;
  public editable: boolean;
  public deletable: boolean;
  public changeStatusPermission: boolean;

  public rankingIcons = ['gold-medal', 'silver-medal', 'bronze-medal'];

  constructor(
    private readonly userService: UserService,
    private readonly activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    const menuKey = this.activatedRoute.snapshot.data.menuKey;

    this.userService.user$.subscribe((user) => {
      this.listable = user.privileges
        .map((item) => item.key)
        .includes(`${menuKey}_LISTAR`);
      this.editable = user.privileges
        .map((item) => item.key)
        .includes(`${menuKey}_MODIFICAR`);
      this.deletable = user.privileges
        .map((item) => item.key)
        .includes(`${menuKey}_REMOVER`);
      this.changeStatusPermission = !![3, 2].find(
        (e) => e === parseInt(user.role.id)
      );
    });
  }

  ngOnInit(): void {
    this.defaultPageSize = this.config?.paginatorConfig?.defaultPageSize
      ? this.config.paginatorConfig.defaultPageSize
      : this.defaultPageSize;
    this.pageIndex = 0;
    this.pageSize = this.defaultPageSize;

    if (!this.config?.paginatorConfig?.requestPagination) {
      this.dataSource = this.data.slice(0, this.defaultPageSize);
    } else {
      this.dataSource = this.data.rows;
    }
  }

  onChangeStatus(data: any) {
    if (data.value)
      this.dataSource = this.data.rows.filter((e) => data.value === e.status);
    else this.dataSource = this.data.rows;
  }

  ngOnChanges(): void {
    this.pageIndex = 0;
    this.pageSize = this.defaultPageSize;

    if (!this.config?.paginatorConfig?.requestPagination) {
      this.dataSource = this.data.slice(0, this.defaultPageSize);
      this.dataSourceLength = this.data.length;
    } else {
      this.dataSource = this.data.rows;
      this.dataSourceLength = this.data.count;
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row.id));
  }

  formatIdentificationNumber(input: string): string {
    if (input) {
      let value = input.replace(/\D/g, '');

      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }

      if (value.length <= 14) {
        value = value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          '$1.$2.$3/$4-$5'
        );
      }

      return value;
    }
  }

  formatPhoneNumber(phone: string): string {
    return `+${phone.substring(0, 2)} (${phone.substring(
      2,
      4
    )}) ${phone.substring(4, 9)}-${phone.substring(9)}`;
  }

  getByKeyValue(data: any, key: string, type?: string): any {
    let keyFiltered = data[key];

    if (key.includes('.')) {
      keyFiltered = data;

      key.split('.').forEach((element) => {
        keyFiltered = keyFiltered[element];
      });
    }

    switch (type) {
      case 'timestamp':
        let adjustedDate = new Date(keyFiltered);
        adjustedDate.setHours(adjustedDate.getHours() - 3);
        return adjustedDate;
      case 'length':
        return keyFiltered.length;
      case 'identificationNumber':
        return this.formatIdentificationNumber(keyFiltered);
      case 'phoneNumber':
        return this.formatPhoneNumber(keyFiltered);
      case 'boolean':
        return keyFiltered ? 'Sim' : 'Não';
      default:
        return keyFiltered as string;
    }
  }

  sortData(sort: Sort): void {
    if (!this.config?.sortConfig?.requestPagination) {
      if (!sort.active || sort.direction === '') {
        this.dataSource = this.data.sort((a, b) => a.id - b.id);
      } else {
        this.dataSource = this.data.sort((a, b) => {
          const isAsc = sort.direction === 'asc';
          return compare(a[sort.active], b[sort.active], isAsc);
        });
      }

      this.applyPagination();
      this.applyFilter();
    } else {
      this.sortabled.emit(
        sort.direction !== ''
          ? { field: sort.active, sort: sort.direction }
          : {}
      );
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.applyPagination();
  }

  applyPagination(): void {
    if (!this.config?.paginatorConfig?.requestPagination) {
      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      this.dataSource = this.data.slice(startIndex, endIndex);
      this.dataSourceLength = this.data.count;
    } else {
      this.dataSource = this.data.rows;
      this.dataSourceLength = this.data.count;
      this.paginated.emit({
        pageNumber: this.pageIndex + 1,
        perPage: this.pageSize,
      });
    }
  }

  applyFilter() {
    if (!this.config?.searchableConfig?.requestPagination) {
      const filterValueLowerCase = this.filterValue.toLowerCase();
      const filteredData = this.data.filter((item) =>
        Object.keys(item).some((key) =>
          item[key]?.toString().toLowerCase().includes(filterValueLowerCase)
        )
      );

      const startIndex = this.pageIndex * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.dataSource = filteredData.slice(startIndex, endIndex);
    } else {
      this.filtered.emit({ name: this.filterValue });
    }
  }

  navigateUrl(): void {
    if (this.config?.navigateUrl) {
      this.router.navigateByUrl(this.config?.navigateUrl);
    }
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
