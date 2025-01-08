import { Route } from '@angular/router';

import { RolesListComponent } from './components/roles-list/roles-list.component';
import { RolesFormComponent } from './components/roles-form/roles-form.component';

export const rolesRoutes: Route[] = [
  {
    path: '',
    component: RolesListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: RolesFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: RolesFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
