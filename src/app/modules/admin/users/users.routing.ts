import { Route } from '@angular/router';

import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersFormComponent } from './components/users-form/users-form.component';

export const usersRoutes: Route[] = [
  {
    path: '',
    component: UsersListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: UsersFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: UsersFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
