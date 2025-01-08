import { Route } from '@angular/router';
import { TermsComponent } from './terms.component';

export const termsRoutes: Route[] = [
  {
    path: '',
    component: TermsComponent,
    data: {
      title: 'Termos de serviços',
    },
  },
];
