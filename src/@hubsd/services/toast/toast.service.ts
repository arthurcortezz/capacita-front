import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HubsdToastConfigInterface } from '@hubsd/components/toast/toast.types';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HubsdToastService {
  private _message$: BehaviorSubject<{
    title: string;
    description?: string[];
  } | null> = new BehaviorSubject<{
    title: string;
    description?: string[];
  } | null>(null);
  private _show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _icon$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private _color$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  get show$(): Observable<boolean> {
    return this._show$.asObservable();
  }

  get message$(): Observable<{ title: string; description?: string[] }> {
    return this._message$.asObservable();
  }

  get icon$(): Observable<string> {
    return this._icon$.asObservable();
  }

  get color$(): Observable<string> {
    return this._color$.asObservable();
  }

  hide(): void {
    this._show$.next(false);
  }
  handleMessage(
    content:
      | string
      | HttpErrorResponse
      | { message: string }
      | { error: { message: string | string[] } },
    title?: string,
    config?: HubsdToastConfigInterface
  ): void {
    this._show$.next(true);

    if (
      config?.handleRequest &&
      (content instanceof HttpErrorResponse ||
        (typeof content !== 'string' && 'error' in content))
    ) {
      this._icon$.next('mat_outline:cancel');
      this._color$.next('danger');
      if ('error' in content && Array.isArray(content.error.message)) {
        this._message$.next({ title, description: content.error.message });
      } else if ('error' in content && content.error.message !== undefined) {
        this._message$.next({ title: content.error.message });
      } else {
        this._message$.next({
          title: 'Algum erro interno ocorreu, por favor tente mais tarde!',
        });
      }
    } else if (
      config?.handleRequest &&
      typeof content !== 'string' &&
      'message' in content
    ) {
      this._color$.next('primary');
      this._icon$.next('mat_outline:check_circle');
      this._message$.next({ title: content.message });
    } else if (typeof content === 'string') {
      this._message$.next({ title: content });
    }
  }
}
