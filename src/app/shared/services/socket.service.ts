import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { UserService } from '../../core/user/user.service';
import { UserJWTInterface } from '../../core/user/user.types';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private userId = null;

  constructor(
    private readonly socket: Socket,
    private readonly userService: UserService
  ) {
    this.userService.user$.subscribe((res: UserJWTInterface) => {
      this.userId = res.id ? res.id : null;
    })
  }
}
