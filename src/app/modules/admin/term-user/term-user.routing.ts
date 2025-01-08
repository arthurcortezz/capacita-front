import { Route } from '@angular/router';

import { TermUserFormComponent } from './components/term-user-form/term-user-form.component';

export const termUserRouting: Route[] = [
  {
    path: '',
    component: TermUserFormComponent,
    data: {
      title: 'Editar',
    }
  },
];
