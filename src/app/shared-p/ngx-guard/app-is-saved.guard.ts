import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { AppMessageBoxButton, AppMessageBoxService } from '../bs-wrapper/app-message-box.service';
import { AppLocaleService } from '../locale/app-locale.service';
import { AppIsSaved } from './app-is-saved';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const appIsSavedGuard: CanDeactivateFn<AppIsSaved> = async (component, currentRoute, currentState, nextState) => {
  const router = inject(Router);
  const l = inject(AppLocaleService);
  const appMessageBoxService = inject(AppMessageBoxService);

  if (await component.isSavedAsync()) return true;

  const msg = l.getLocaleMessage('C1001');
  const buttons: AppMessageBoxButton[] = [
    { name: l.txt('COMMON.BUTTON.YES'), cssClass: 'btn-cta' },
    { name: l.txt('COMMON.BUTTON.NO'), cssClass: 'btn-default' }
  ];

  // HACK: ngx-bootstrap 10.x + bootstrap 5.1.xでは、モーダル表示が怪しい
  // bootstrapのmodalが1度以上実行した後、ブラウザ戻る/進むでこの処理に到達するとbackdrop表示が消えてしまう
  // await AppPromise.delay(301)を入れると確実に正常に動作するため、何かが干渉している模様
  const dialogResult = await appMessageBoxService.showAsync(msg, undefined, buttons);
  if (dialogResult === 0) return true;

  // HACK: 詳細は下記
  // 前提
  // 1. ブラウザ戻る/進む時、AngularはpopStateをトリガにcanDeactivateを開始する。つまり既に履歴は遷移済み
  // 2. ブラウザ戻る/進む時、canDeactivate下では履歴は遷移済み、currentStateは遷移前
  // 3. ブラウザ戻る/進む時、canDeactivateでfalseを返すと、履歴をhistory.replaceで上書きしてしまう
  // 4. ブラウザ戻る/進む時、javascriptはどちらが行われたかを知ることが出来ない
  // 
  // 詳細
  // https://github.com/angular/angular/issues/13586#issuecomment-458241789
  //
  // 暫定対応
  // https://github.com/angular/angular/issues/13586#issuecomment-402250031
  // 履歴を完全には保持できないため、最も実用性の高い挙動で対応
  // ブラウザ「戻る」「進む」をキャンセルした場合、どちらの場合も先にある履歴が消える
  // 「進む」をキャンセルした場合、1つ先からさらにnavigateByUrlするため2つ余計な履歴が増える
  if (!window.location.href.endsWith(currentState.url)) {
    await router.navigateByUrl(currentState.url);
  }
  return false;
};
