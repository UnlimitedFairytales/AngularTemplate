import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AppModalService } from '../bs-wrapper/app-modal.service';
import { AppAjaxService, AppJsonResult } from '../ngx-http/app-ajax.service';
import { AppLoginDialogComponent, AppLoginDialogComponentInitialData, APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA } from './app-login-dialog/app-login-dialog.component';

export const APP_AUTH_ENDPOINTS = new InjectionToken<AppAuthEndpoints>('appAuthEndpoints');

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppAuthEndpoints = {
  isLoggedin: string,
  getLoggedinUserInfo: string,
  isAuthorizedPage: string,
}
export type IsLoggedinResult = AppJsonResult & { IsLoggedin: number }
export type LoggedinUserInfoResult<T> = AppJsonResult & { UserInfo?: T }
export type IsAuthorizedPageResult = AppJsonResult & { IsAuthorizedPage: number }

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AppAuthService<T = any> {

  loggedinUserInfoCache?: T;

  constructor(
    protected appAjaxService: AppAjaxService,
    protected appModalService: AppModalService,
    @Inject(APP_AUTH_ENDPOINTS) protected appAuthEndpoints: AppAuthEndpoints,
    @Inject(APP_LOGIN_DIALOG_COMPONENT_INITIAL_DATA) protected appLoginDialogComponentInitialData: AppLoginDialogComponentInitialData) { }

  /**
   * 認証済みか、そうでないならばLoginフローを実施する
   * @returns (awaitable) 認証済みか
   */
  async isLoggedinOrStartLoginFlowAsync(): Promise<boolean> {
    const result = await this.appAjaxService.postAsync<IsLoggedinResult>(this.appAuthEndpoints.isLoggedin, undefined);
    if (result.MessageId) return false;
    if (!result.IsLoggedin) {
      const dialogResult = await this.appModalService.showAsync(AppLoginDialogComponent, this.appLoginDialogComponentInitialData);
      if (dialogResult.isCanceled) return false;
    }

    const loggedinUserInfoResult = await this.appAjaxService.postAsync<LoggedinUserInfoResult<T>>(this.appAuthEndpoints.getLoggedinUserInfo, undefined);
    if (loggedinUserInfoResult.MessageId) return false;
    this.loggedinUserInfoCache = loggedinUserInfoResult.UserInfo;

    return true;
  }

  /**
   * 閲覧可能か。この処理はCanActivateの参考にしかならず、セキュリティの担保にはならない。
   * （pageCdは改ざん可能 & javascriptからページの存在はわかる。セキュリティの観点では、各API自体が認証・認可チェックをする以外の方法はない）
   * @param pageCd 遷移先のPageCd
   * @returns 閲覧可能か
   */
  async isAuthorizedPage(pageCd: string): Promise<boolean> {
    const isAuthorizedPageResult = await this.appAjaxService.postAsync<IsAuthorizedPageResult>(this.appAuthEndpoints.isAuthorizedPage, { PageCd: pageCd });
    if (isAuthorizedPageResult.MessageId) return false;
    if (!isAuthorizedPageResult.IsAuthorizedPage) return false;
    return true;
  }
}
