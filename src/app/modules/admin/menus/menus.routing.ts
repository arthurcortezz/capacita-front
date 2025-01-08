import { Route } from '@angular/router';

import { MenusListComponent } from './components/menus-list/menus-list.component';
import { MenusFormComponent } from "./components/menus-form/menus-form.component";

export const menusRoutes: Route[] = [
  {
    path: '',
    component: MenusListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: MenusFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: MenusFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
