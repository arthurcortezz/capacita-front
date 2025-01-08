import { CompanyInterface } from '../companies/companies.types';
import { RoleInterface } from '../roles/roles.types';

export interface ConsultantInterface {
  id?: number;
  name: string;
  email: string;
  personType: 'FÍSICA' | 'JURÍDICA';
  identificationNumber?: string;
  cpf?: string;
  cnpj?: string;
  password?: string;
  companyId: number;
  company?: CompanyInterface;
  roleId: number;
  role?: RoleInterface;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultantPaginatedInterface {
  rows: ConsultantInterface[];
  count: number;
}

export interface ConsultantFilterInterface {
  name?: string;
}
