import { InjectionToken, Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export const APP_HTTP_TIMEOUT_SEC = new InjectionToken<number>('appHttpTimeout_sec');

@Injectable()
export class AppTimeoutInterceptor implements HttpInterceptor {

  constructor(@Inject(APP_HTTP_TIMEOUT_SEC) protected appHttpTimeout_sec: number) { }

  /* implements HttpInterceptor */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(timeout(this.appHttpTimeout_sec * 1000));
  }
}
