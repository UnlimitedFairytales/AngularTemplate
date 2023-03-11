/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { AppAjaxService, options_body_blob, options_body_json } from 'src/app/shared-p/ngx-http/app-ajax.service';
import { AppPromise } from 'src/app/utils/helpers/app-promise';

@Injectable()
export class StubAjaxService extends AppAjaxService {

  override async getAsync(url: string, options?: options_body_blob | undefined): Promise<Blob>;
  override async getAsync(url: string, options?: options_body_json | undefined): Promise<Object>;
  override async getAsync<T>(url: string, options?: options_body_json | undefined): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async getAsync<T>(url: string, options?: options_body_blob | options_body_json | undefined): Promise<Object | Blob | T> {
    url = url.startsWith('http') ? url : `${this.appAjaxServerUrl}${url}`;
    await AppPromise.delay(50);
    // sample-a2
    if (url === 'https://jsonplaceholder.typicode.com/albums') {
      return [
        { "userId": 1, "id": 1, "title": "stub data1" },
        { "userId": 1, "id": 2, "title": "stub data2" }
      ];
    }
    throw new Error(`no stub endpoint (stub-ajax.service.ts) : ${url}`);
  }

  override async postAsync(url: string, body?: any, options?: options_body_blob | undefined): Promise<Blob>;
  override async postAsync(url: string, body?: any, options?: options_body_json | undefined): Promise<Object>;
  override async postAsync<T>(url: string, body?: any, options?: options_body_json | undefined): Promise<T>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async postAsync<T>(url: string, body?: any, options?: options_body_blob | options_body_json | undefined): Promise<Object | Blob | T> {
    url = url.startsWith('http') ? url : `${this.appAjaxServerUrl}${url}`;
    await AppPromise.delay(50);
    // sample-a2
    if (url === 'https://jsonplaceholder.typicode.com/albums') {
      return Object.assign({ "id": 99999999 }, body);
    }
    throw new Error(`no stub endpoint (stub-ajax.service.ts) : ${url}`);
  }

  protected override  retryHttp(): MonoTypeOperatorFunction<Object | Blob> {
    throw new Error('Method not implemented.');
  }
}
