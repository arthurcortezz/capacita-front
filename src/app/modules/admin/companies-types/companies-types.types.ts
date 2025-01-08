export interface CompanyTypeInterface {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CompanyTypePaginatedInterface {
  rows: CompanyTypeInterface[];
  count: number;
}

export interface CompanyTypeFilterInterface {
  name?: string;
}