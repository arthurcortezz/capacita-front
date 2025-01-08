import { Route } from '@angular/router';

import { ActionsListComponent } from './components/actions-list/actions-list.component';
import { ActionsFormComponent } from './components/actions-form/actions-form.component';

export const actionsRoutes: Route[] = [
  {
    path: '',
    component: ActionsListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: ActionsFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: ActionsFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
