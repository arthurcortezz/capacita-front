export interface RoleInterface {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePaginatedInterface {
  rows: RoleInterface[];
  count: number;
}

export interface RoleFilterInterface {
  name?: string;
}