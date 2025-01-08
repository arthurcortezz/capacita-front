import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'hubsd-menu',
  templateUrl: './menu.component.html',
})
export class HubsdMenuComponent {
  @Input() hideLogo: boolean = false;
  constructor(private readonly router: Router) {}

  clickBack(): void {
    this.router.navigate(['/']);
  }
}
