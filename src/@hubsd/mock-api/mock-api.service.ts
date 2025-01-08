import { Injectable } from '@angular/core';
import { compact, fromPairs } from 'lodash-es';

import { HubsdMockApiHandler } from '@hubsd/mock-api/mock-api.request-handler';
import { HubsdMockApiMethods } from '@hubsd/mock-api/mock-api.types';

@Injectable({
    providedIn: 'root'
})
export class HubsdMockApiService {
  private _handlers: { [key: string]: Map<string, HubsdMockApiHandler> } = {
    'get'    : new Map<string, HubsdMockApiHandler>(),
    'post'   : new Map<string, HubsdMockApiHandler>(),
    'patch'  : new Map<string, HubsdMockApiHandler>(),
    'delete' : new Map<string, HubsdMockApiHandler>(),
    'put'    : new Map<string, HubsdMockApiHandler>(),
    'head'   : new Map<string, HubsdMockApiHandler>(),
    'jsonp'  : new Map<string, HubsdMockApiHandler>(),
    'options': new Map<string, HubsdMockApiHandler>()
  };

  constructor() {}

  findHandler(method: string, url: string): { handler: HubsdMockApiHandler | undefined; urlParams: { [key: string]: string } } {
    const matchingHandler: { handler: HubsdMockApiHandler | undefined; urlParams: { [key: string]: string } } = {
        handler  : undefined,
        urlParams: {}
    };

    const urlParts = url.split('/');
    const handlers = this._handlers[method.toLowerCase()];

    handlers.forEach((handler, handlerUrl) => {
      if (matchingHandler.handler) {
        return;
      }

      const handlerUrlParts = handlerUrl.split('/');

      if ( urlParts.length !== handlerUrlParts.length ) {
        return;
      }

      const matches = handlerUrlParts.every((handlerUrlPart, index) => handlerUrlPart === urlParts[index] || handlerUrlPart.startsWith(':'));

      if (matches) {
          matchingHandler.handler = handler;
          matchingHandler.urlParams = fromPairs(compact(handlerUrlParts.map((handlerUrlPart, index) =>
            handlerUrlPart.startsWith(':') ? [handlerUrlPart.substring(1), urlParts[index]] : undefined
          )));
        }
      });

      return matchingHandler;
  }

  onGet(url: string, delay?: number): HubsdMockApiHandler {
    return this.registerHandler('get', url, delay);
  }

  onPost(url: string, delay?: number): HubsdMockApiHandler {
    return this.registerHandler('post', url, delay);
  }

  onPatch(url: string, delay?: number): HubsdMockApiHandler {
    return this.registerHandler('patch', url, delay);
  }

  onDelete(url: string, delay?: number): HubsdMockApiHandler {
      return this.registerHandler('delete', url, delay);
  }

  onPut(url: string, delay?: number): HubsdMockApiHandler {
    return this.registerHandler('put', url, delay);
  }

  onHead(url: string, delay?: number): HubsdMockApiHandler {
      return this.registerHandler('head', url, delay);
  }

  onJsonp(url: string, delay?: number): HubsdMockApiHandler {
      return this.registerHandler('jsonp', url, delay);
  }

  onOptions(url: string, delay?: number): HubsdMockApiHandler {
    return this.registerHandler('options', url, delay);
  }

  private registerHandler(method: HubsdMockApiMethods, url: string, delay?: number): HubsdMockApiHandler {
    const hubsdMockHttp = new HubsdMockApiHandler(url, delay);
    this._handlers[method].set(url, hubsdMockHttp);
    return hubsdMockHttp;
  }
}
