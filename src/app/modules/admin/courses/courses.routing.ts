import { Route } from '@angular/router';

import { CoursesListComponent } from './components/courses-list/courses-list.component';
import { CoursesFormComponent } from './components/courses-form/courses-form.component';
import { CoursesViewComponent } from './components/courses-view/courses-view.component';
import { CoursesStepComponent } from './components/courses-step/courses-step.component';

export const coursesRoutes: Route[] = [
  {
    path: '',
    component: CoursesListComponent,
    data: {
      title: 'Listar',
    },
  },
  {
    path: 'criar',
    component: CoursesFormComponent,
    data: {
      title: 'Criar',
    },
  },
  {
    path: 'editar/:id',
    component: CoursesFormComponent,
    data: {
      title: 'Editar',
    },
  },
  {
    path: 'visualizar/:id',
    component: CoursesViewComponent,
    data: {
      title: 'Visualizar',
    },
    children: [
      {
        path: ':idStep',
        component: CoursesStepComponent,
        data: {
          title: 'Aula',
        },
      },
    ],
  },
];
