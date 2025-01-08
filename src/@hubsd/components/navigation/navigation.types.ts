export interface HubsdNavigationItem {
  id?: string;
  menu?: string;
  icon?: string;
  route?: string;
}

export type HubsdNavigationAppearance =
  | 'default'
  | 'compact'
  | 'dense'
  | 'thin';

export type HubsdNavigationMode = 'over' | 'side';

export type HubsdNavigationPosition = 'left' | 'right';
