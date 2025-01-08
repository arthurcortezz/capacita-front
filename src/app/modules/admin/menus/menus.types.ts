import { ActionInterface } from '../actions/actions.types';

export interface MenuInterface {
  id?: number;
  name: string;
  route: string;
  menuKey: string;
  icon: string;
  actionsMenus?: MenuActionInterface[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MenuActionInterface {
  id: number;
  actionId: number;
  menuId: number;
  action: ActionInterface;
  privileges: PrivilegeInterface[];
}

export interface PrivilegeInterface {
  roleId?: number;
  actionMenuId?: number;
  key?: string[];
}

export interface MenuPaginatedInterface {
  rows: MenuInterface[];
  count: number;
}

export interface MenuFilterInterface {
  name?: string;
}
