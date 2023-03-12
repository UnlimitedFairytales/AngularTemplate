/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { lastValueFrom, MonoTypeOperatorFunction, Observable, retry, TimeoutError, timer } from 'rxjs';
import { AppObject } from 'src/app/utils/helpers/app-object';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppJsonResult = { MessageId?: string }

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type optionsCommon = {
  headers?: HttpHeaders | { [header: string]: string | string[]; };
  context?: HttpContext;
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>; };
  reportProgress?: boolean;
  withCredentials?: boolean;
}
// type options_body_arbf = optionsCommon & { observe?: 'body'; responseType: 'arraybuffer'; }
export type options_body_blob = optionsCommon & { observe?: 'body'; responseType: 'blob'; }
// type options_body_text = optionsCommon & { observe?: 'body'; responseType: 'text'; }
export type options_body_json = optionsCommon & { observe?: 'body'; responseType?: 'json'; }
// type options_events_arbf = optionsCommon & { observe: 'events'; responseType: 'arraybuffer'; }
// type options_events_blob = optionsCommon & { observe: 'events'; responseType: 'blob'; }
// type options_events_text = optionsCommon & { observe: 'events'; responseType: 'text'; }
// type options_events_json = optionsCommon & { observe: 'events'; responseType: 'json'; }
// type options_response_arbf = optionsCommon & { observe: 'response'; responseType: 'arraybuffer'; }
// type options_response_blob = optionsCommon & { observe: 'response'; responseType: 'blob'; }
// type options_response_text = optionsCommon & { observe: 'response'; responseType: 'text'; }
// type options_response_json = optionsCommon & { observe: 'response'; responseType: 'json'; }

export const APP_AJAX_SERVER_URL = new InjectionToken<string>('appAjaxServerUrl');
export const APP_AJAX_RETRY_COUNT = new InjectionToken<number>('appAjaxRetryCount');
export const APP_AJAX_RETRY_DELAY_SEC = new InjectionToken<number>('appAjaxRetryDelay_sec');

/**
 * HttpClient wrapper (for Ajax)
 * https://www.youtube.com/watch?v=KOOT7BArVHQ
 */
@Injectable()
export class AppAjaxService {

  constructor(
    @Inject(APP_AJAX_SERVER_URL) protected appAjaxServerUrl: string,
    @Inject(APP_AJAX_RETRY_COUNT) protected appAjaxRetryCount: number,
    @Inject(APP_AJAX_RETRY_DELAY_SEC) protected appAjaxRetryDelay_sec: number,
    protected httpClient: HttpClient) { }

  /**
   * AngularのHttpClient.getに「デフォルトリクエスト先機能」「429 or 503 retry機能」を追加してPromiseに変換したメソッド
   * @param url HttpClient.getと同様。ただしhttpで始まらない文字列が渡された場合、「appAjaxServerUrl + url」にする
   * @param options HttpClient.getと同様 (body-blobとbody-jsonだけ用意)
   * @returns (awaitable) JsonまたはBlob
   */
  async getAsync(url: string, options?: options_body_json): Promise<Object>;
  async getAsync(url: string, options: options_body_blob): Promise<Blob>;
  async getAsync<T>(url: string, options?: options_body_json): Promise<T>;
  async getAsync<T>(url: string, options?: options_body_blob | options_body_json): Promise<Object | Blob | T> {
    url = url.startsWith('http') ? url : `${this.appAjaxServerUrl}${url}`;
    let obs$: Observable<Blob> | Observable<Object> | Observable<T>;
    if (!AppObject.isNullish(options) &&
      options.observe === 'body' &&
      options.responseType === 'blob') {
      obs$ = this.httpClient.get(url, options)
        .pipe(this.retryHttp());
    } else {
      obs$ = this.httpClient.get(url, options as options_body_json)
        .pipe(this.retryHttp());
    }
    return lastValueFrom(obs$);
  }

  /**
   * AngularのHttpClient.postに「デフォルトリクエスト先機能」「429 or 503 retry機能」を追加してPromiseに変換したメソッド
   * @param url HttpClient.postと同様。ただしhttpで始まらない文字列が渡された場合、「appAjaxServerUrl + url」にする
   * @param body HttpClient.postと同様
   * @param options HttpClient.postと同様 (body-blobとbody-jsonだけ用意)
   * @returns (awaitable) JsonまたはBlob
   */
  async postAsync(url: string, body: any, options?: options_body_json): Promise<Object>;
  async postAsync(url: string, body: any, options: options_body_blob): Promise<Blob>;
  async postAsync<T>(url: string, body: any, options?: options_body_json): Promise<T>;
  async postAsync<T>(url: string, body: any, options?: options_body_blob | options_body_json): Promise<Object | Blob | T> {
    url = url.startsWith('http') ? url : `${this.appAjaxServerUrl}${url}`;
    let obs$: Observable<Blob> | Observable<Object> | Observable<T>;
    if (!AppObject.isNullish(options) &&
      options.observe === 'body' &&
      options.responseType === 'blob') {
      obs$ = this.httpClient.post(url, body, options)
        .pipe(this.retryHttp());
    } else {
      obs$ = this.httpClient.post(url, body, options as options_body_json)
        .pipe(this.retryHttp());
    }
    return lastValueFrom(obs$);
  }

  protected retryHttp(): MonoTypeOperatorFunction<Blob | Object> {
    const cnt = this.appAjaxRetryCount;
    const dly_ms = this.appAjaxRetryDelay_sec * 1000;
    return retry(
      {
        count: cnt,
        delay: (error, count) => {
          if (error instanceof TimeoutError) throw error;
          if (error && error.status === 0) throw error;
          if (error && 400 <= error.status && error.status !== 429 && error.status !== 503) throw error;
          console.log(error);
          console.log(`retry(count:${count}/${cnt}, delay:${dly_ms})`);
          return timer(dly_ms);
        }
      });
  }
}
