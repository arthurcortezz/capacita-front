export interface ActionInterface {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ActionPaginatedInterface {
  rows: ActionInterface[];
  count: number;
}

export interface ActionFilterInterface {
  name?: string;
}