import { CompanyInterface } from '../../modules/admin/companies/companies.types';
import { CityInterface } from '../common/common.types';

export interface UserJWTInterface {
  id: string;
  name: string;
  email: string;
  personType: 'FÍSICA' | 'JURÍDICA';
  identificationNumber?: string;
  companyId: number;
  company?: CompanyInterface;
  roleId: number;
  role: RoleInterface;
  menus: MenuInterface[];
  privileges: { key: string }[];
  createdAt: Date;
  plan?: string;
  address: UserAddressInterface;
}

export interface UserAddressInterface {
  cep: string;
  state: string;
  cityId: number;
  city?: CityInterface;
  number: string;
  street: string;
  complement: string;
  neighborhood: string;
}

export interface RoleInterface {
  id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MenuInterface {
  menu: string;
  icon: string;
  route: string;
  menuKey: string;
}
