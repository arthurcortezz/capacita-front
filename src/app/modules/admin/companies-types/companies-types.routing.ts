import { Route } from '@angular/router';

import { CompaniesTypesListComponent } from './components/companies-types-list/companies-types-list.component';
import { CompaniesTypesFormComponent } from './components/companies-types-form/companies-types-form.component';

export const companiesRoutes: Route[] = [
  {
    path: '',
    component: CompaniesTypesListComponent,
    data: {
      title: 'Listar',
    }
  },
  {
    path: 'criar',
    component: CompaniesTypesFormComponent,
    data: {
      title: 'Criar',
    }
  },
  {
    path: 'editar/:id',
    component: CompaniesTypesFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
