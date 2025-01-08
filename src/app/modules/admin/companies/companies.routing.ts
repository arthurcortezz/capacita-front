import { Route } from '@angular/router';

import { CompaniesListComponent } from './components/companies-list/companies-list.component';
import { CompaniesFormComponent } from './components/companies-form/companies-form.component';

export const companiesRoutes: Route[] = [
  {
    path: '',
    component: CompaniesListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: CompaniesFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: CompaniesFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
