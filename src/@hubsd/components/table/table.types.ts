export interface HubsdTableInterface {
  view?:boolean;
  changes?:boolean;
  allowChanges?:boolean;
  orderBy?:boolean;
  title: string;
  headers: HubsdTableHeaderInterface[];
  content: HubsdTableContentInterface[];
  actions?: boolean;
  selection?: boolean;
  searchable?: boolean;
  searchableConfig?: HubsdTableFilterConfigInterface;
  paginator?: boolean;
  paginatorConfig?: HubsdTablePaginatorConfigInterface;
  sortable?: boolean;
  sortConfig?: HubsdTableSortConfigInterface;
  showMore?: boolean;
  navigateUrl?: string;
}

export interface HubsdTableHeaderInterface {
  name: string;
  key?: string;
}

export interface HubsdTableContentInterface {
  type: string;
  key: string;
}

export interface HubsdTablePaginatorConfigInterface {
  defaultPageSize?: number;
  requestPagination?: boolean;
}

export interface HubsdTableFilterConfigInterface {
  requestPagination?: boolean;
}

export interface HubsdTableSortConfigInterface {
  requestPagination?: boolean;
}

export interface HubsdTablePaginatorInterface {
  pageNumber: number;
  perPage: number;
}

export interface HubsdTableSortInterface {
  field: string;
  sort: 'asc' | 'desc';
}
