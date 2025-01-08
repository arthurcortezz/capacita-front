import { Route } from '@angular/router';

import { ParametersListComponent } from './components/parameters-list/parameters-list.component';
import { ParametersFormComponent } from './components/parameters-form/parameters-form.component';

export const parametersRoutes: Route[] = [
  {  
    path: '',
    component: ParametersListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: ParametersFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: ParametersFormComponent,
    data: {
      title: 'Editar',
    }
  }
];

