import { Route } from '@angular/router';

import { ConsultantsListComponent } from './components/consultants-list/consultants-list.component';
import { ConsultantsFormComponent } from './components/consultants-form/consultants-form.component';

export const consultantsRouting: Route[] = [
  {
    path: '',
    component: ConsultantsListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: ConsultantsFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: ConsultantsFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
