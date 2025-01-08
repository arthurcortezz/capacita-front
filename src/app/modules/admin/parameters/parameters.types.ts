export interface ParameterInterface {
  id?: number;
  key: string;
  value: string;
  description?: string;
  createdA?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ParameterPaginatedInterface {
  count: number;
  rows: ParameterInterface[];
}

export interface ParameterFilterInterface {
  key: string;
}