import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';

import { HubsdToastService } from '@hubsd/services/toast';

import { MenusService } from '../../menus.service';
import { MenuActionInterface, MenuInterface } from '../../menus.types';

@Component({
  selector: 'menus-form',
  templateUrl: './menus-form.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class MenusFormComponent implements OnInit, OnDestroy {
  public id: number;
  public form: UntypedFormGroup;
  public menu: MenuInterface;
  private readonly unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly toastService: HubsdToastService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly service: MenusService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      route: ['', [Validators.required]],
      icon: ['', [Validators.required]],
      menuKey: ['', [Validators.required]],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = parseInt(params.get('id'));

      if (this.id) {
        this.service
          .findOne(this.id)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe((res: MenuInterface) => {
            this.menu = res;
            this.form.patchValue(res);
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  handleSaveOrUpdate(): void {
    this.form.disable();

    if (this.id) {
      this.service
        .update(this.id, {
          ...this.form.value,
          actionsMenus: this.menu.actionsMenus,
          id: this.id,
        })
        .pipe(takeUntil(this.unsubscribeAll))
        .pipe(
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, { handleRequest: true });
            this.router.navigateByUrl('menus');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível modificar o menu.',
              { handleRequest: true }
            );
          },
        });
    } else {
      this.service
        .create(this.form.value)
        .pipe(takeUntil(this.unsubscribeAll))
        .pipe(
          finalize(() => {
            this.form.enable();
          })
        )
        .subscribe({
          next: (res) => {
            this.toastService.handleMessage(res, null, { handleRequest: true });
            this.router.navigateByUrl('menus');
          },
          error: (error) => {
            this.toastService.handleMessage(
              error,
              'Não foi possível criar o menu.',
              { handleRequest: true }
            );
          },
        });
    }
  }

  syncPrivileges(actionsMenus: MenuActionInterface[]): void {
    this.menu.actionsMenus = actionsMenus;
  }
}
