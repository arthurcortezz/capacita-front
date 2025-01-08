import { Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hubsd-application-menu',
  templateUrl: './application-menu.component.html',
})
export class HubsdApplicationMenuComponent {
  @Input() id: number;
  @Input() icon: string;
  @Input() title: string;
  @Input() action: string;
  @Output() handleAction: EventEmitter<any> = new EventEmitter();
}
