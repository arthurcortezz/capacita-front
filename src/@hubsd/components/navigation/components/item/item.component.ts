import { Component, Input } from '@angular/core';
import { HubsdNavigationItem } from '@hubsd/components/navigation';
import { hubsdAnimations } from '@hubsd/animations';

@Component({
  animations: hubsdAnimations,
  selector: 'hubsd-navigation-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class HubsdNavigationItemComponent {
  @Input() item: HubsdNavigationItem;
  @Input() hovered: boolean;

  constructor() {}
}
