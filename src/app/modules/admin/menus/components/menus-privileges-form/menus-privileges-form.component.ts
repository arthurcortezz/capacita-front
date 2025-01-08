import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subject, takeUntil } from 'rxjs';

import { ActionsService } from '../../../actions/actions.service';
import { RolesService } from '../../../roles/roles.service';
import { ActionInterface } from '../../../actions/actions.types';
import { RoleInterface } from '../../../roles/roles.types';
import { MenuActionInterface, PrivilegeInterface } from '../../menus.types';

@Component({
  selector: 'menus-privileges-form',
  templateUrl: './menus-privileges-form.component.html',
})
export class MenusPrivilegesFormComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['role'];
  public actions: ActionInterface[] = [];
  public roles: RoleInterface[] = [];
  public end: number;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  @Input() actionsMenus!: MenuActionInterface[];
  @Output() emitter = new EventEmitter<any[]>();

  constructor(
    private readonly actionsService: ActionsService,
    private readonly rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.actionsService
      .findAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: ActionInterface[]) => {
        this.actions = res.sort((a: ActionInterface, b: ActionInterface) => {
          return a.id - b.id;
        });
        this.actions.forEach((action) => {
          this.displayedColumns.push(action.name);
        });
        this.end = this.displayedColumns.length;
      });

    this.rolesService
      .findAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((res: RoleInterface[]) => {
        this.roles = res;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  setPrivilege(
    event: MatCheckboxChange,
    menuAction: MenuActionInterface,
    roleId: number
  ): void {
    if (event.checked) {
      menuAction?.privileges.push({
        actionMenuId: menuAction.id,
        roleId,
      });
    } else {
      menuAction?.privileges.splice(
        menuAction?.privileges.findIndex(
          (el) => el.actionMenuId === menuAction.id && el.roleId === roleId
        ),
        1
      );
    }
    this.emitter.emit(this.actionsMenus);
  }

  check(privileges: PrivilegeInterface[], roleId: number): boolean {
    return (
      privileges?.find((privilege) => privilege.roleId === roleId) !== undefined
    );
  }
}
