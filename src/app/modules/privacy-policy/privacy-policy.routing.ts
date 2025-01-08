import { Route } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy.component';

export const privacyRoutes: Route[] = [
  {
    path: '',
    component: PrivacyPolicyComponent,
    data: {
      title: 'Politica de privacidade',
    },
  },
];
