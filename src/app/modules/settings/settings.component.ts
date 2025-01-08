import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'settings-menu',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  public pagina: {
    label: string;
    value: string;
  };
  constructor() {}

  ngOnInit(): void {
    this.pagina = {
      label: 'Editar o perfil',
      value: 'account',
    };
  }

  menuSelect(route: string): void {
    if (route) {
      this.pagina = {
        label: '',
        value: route,
      };
      switch (route) {
        case 'account':
          this.pagina.label = 'Editar o perfil';
          break;
        case 'security':
          this.pagina.label = 'Alterar a senha';
          break;
      }
    }
  }
}
