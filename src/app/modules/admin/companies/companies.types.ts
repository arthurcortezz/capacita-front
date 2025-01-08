import { UserInterface } from '../users/users.types';
import { CityInterface } from '../../../core/common/common.types';

export interface CompanyAddressInterface {
  cep: string;
  state: string;
  cityId: number;
  city?: CityInterface;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
}

export interface CompanyInterface {
  id?: number;
  name: string;
  users?: UserInterface[];
  adminId: number;
  admin?: UserInterface;
  createdAt: Date;
  updatedAt: Date;
  address?: CompanyAddressInterface;
}

export interface CompanyPaginatedInterface {
  rows: CompanyInterface[];
  count: number;
}

export interface CompanyFilterInterface {
  name?: string;
}
