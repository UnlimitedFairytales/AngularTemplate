/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { AppLoginDialogComponentInitialData, APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA } from 'src/app/shared-p/auth/app-login-dialog/app-login-dialog.component';
import { AppAjaxService, APP_AJAX_SERVER_URL, options_body_blob, options_body_json } from 'src/app/shared-p/ngx-http/app-ajax.service';
import { AppPromise } from 'src/app/utils/helpers/app-promise';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type UserInfo = { User: { UserId: number, UserCd: string, UserName: string }, AuthorityList?: string[], IsDevelopMode?: number }

@Injectable()
export class StubAjaxService extends AppAjaxService {

  private loggedinUserInfo?: UserInfo;
  private readonly userInfo1 = { User: { UserId: 1, UserCd: 'USER01', UserName: '名無しの権兵衛' } };
  private readonly userInfo2 = { User: { UserId: 2, UserCd: 'USER02', UserName: '初接続 パスワード設定' } };
  private readonly userInfo3 = { User: { UserId: 3, UserCd: 'USER03', UserName: 'パスワード設定時にエラーを返す' } };

  constructor(
    @Inject(APP_AJAX_SERVER_URL) appAjaxServerUrl: string,
    @Inject(APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA) protected appLoginDialogComponentInitialData: AppLoginDialogComponentInitialData) {
    super(appAjaxServerUrl, 0, 0, HttpClient.prototype);
  }

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

    // AppLoginDialogComponent
    if (url === `${this.appAjaxServerUrl}${this.appLoginDialogComponentInitialData.endpoint_GetDialogMode}`) {
      if (body.UserCd === this.userInfo1.User.UserCd) return { MessageId: undefined, IsResetPass: 0 };
      if (body.UserCd === this.userInfo2.User.UserCd) return { MessageId: undefined, IsResetPass: 1 };
      if (body.UserCd === this.userInfo3.User.UserCd) return { MessageId: undefined, IsResetPass: 1 };
      return { MessageId: 'W5002' }
    }
    if (url === `${this.appAjaxServerUrl}${this.appLoginDialogComponentInitialData.endpoint_SetUserPassword}`) {
      if (body.UserCd === this.userInfo2.User.UserCd) {
        if (0 < (body?.Password as string).trim().length) {
          return { MessageId: undefined };
        }
        return { MessageId: 'W5003' };
      }
      return { MessageId: 'E9999' }
    }
    if (url === `${this.appAjaxServerUrl}${this.appLoginDialogComponentInitialData.endpoint_Login}`) {
      if (body.UserCd === this.userInfo1.User.UserCd && body.Password === this.userInfo1.User.UserCd) {
        this.loggedinUserInfo = this.userInfo1;
        return { MessageId: undefined };
      }
      if (body.UserCd === this.userInfo2.User.UserCd && body.Password === this.userInfo2.User.UserCd) {
        this.loggedinUserInfo = this.userInfo2;
        return { MessageId: undefined };
      }
      return { MessageId: 'W5001' }
    }

    throw new Error(`no stub endpoint (stub-ajax.service.ts) : ${url}`);
  }

  protected override  retryHttp(): MonoTypeOperatorFunction<Object | Blob> {
    throw new Error('Method not implemented.');
  }
}
