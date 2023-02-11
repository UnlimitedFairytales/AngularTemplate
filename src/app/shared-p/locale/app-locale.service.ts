import { Injectable } from '@angular/core';
import { JajpMessages } from 'src/app/configuration/locale/messages.ja-jp';
import { JajpTexts } from 'src/app/configuration/locale/texts.ja-jp';
import { EnusMessages } from 'src/app/configuration/locale/messages.en-us';
import { EnusTexts } from 'src/app/configuration/locale/texts.en-us';

type LocaleResourceKind = 'texts' | 'messages';
export const LOCAL_STORAGE_KEY_LOCALE_ID = 'localeId';

@Injectable()
export class AppLocaleService {

  /**
   * localStorageに保存されたlocaleId
   */
  get storage_LocaleId(): string {
    const storage = window.localStorage;
    return storage.getItem(LOCAL_STORAGE_KEY_LOCALE_ID) ?? '';
  }

  /**
   * localStorageに保存されたlocaleId
   */
  set storage_LocaleId(value: string) {
    const storage = window.localStorage;
    storage.setItem(LOCAL_STORAGE_KEY_LOCALE_ID, value);
  }

  // fields & properties
  // ---------------------------------------------------------------------------
  // methods

  /**
   * getLocaleMessageのエイリアス
   * @param messageId 
   * @param params 
   */
  msg(messageId: string, params?: (string | number)[]) {
    return this.getLocaleMessage(messageId, params);
  }
  /**
   * messageIdに対応するメッセージを取得
   * @param messageId messageId
   * @param params パラメータ
   * @returns メッセージ
   */
  getLocaleMessage(messageId: string, params?: (string | number)[]) {
    const locale = this.storage_LocaleId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val: any = this.getLocaleResource(locale, 'messages');

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    let message = `${val[messageId]} (${messageId})`;
    if (params) {
      for (let i = 0; i < params.length; i++) {
        const reg = new RegExp(`\\{${i}\\}`, 'g');
        message = message.replace(reg, params[i].toString());
      }
    }
    return message;
  }

  /**
   * getLocaleTextのエイリアス
   * @param dotDelimitedString
   * @returns
   */
  txt(dotDelimitedString: string) {
    return this.getLocaleText(dotDelimitedString);
  }
  /**
   * 指定したキーに対するテキストの取得
   * @param dotDelimitedString e.g. COMMON.BUTTON.INSERT
   * @returns テキスト
   */
  getLocaleText(dotDelimitedString: string) {
    const locale = this.storage_LocaleId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = this.getLocaleResource(locale, 'texts');

    const splitted = dotDelimitedString.split('.');
    for (const p of splitted) {
      if (!(val?.[p])) return dotDelimitedString;
      val = val[p];
    }
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${val}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getLocaleResource(locale: string, kind: LocaleResourceKind): any {
    const flatLocaleId = locale
      .toLocaleLowerCase()
      .replace('_', '-');
    switch (flatLocaleId) {
      case 'en-us':
        return kind === 'texts' ? EnusTexts : EnusMessages;
      case 'th-th':
      case 'zh-cn':
      case 'ko-kr':
      case 'ja-jp':
      default:
        return kind === 'texts' ? JajpTexts : JajpMessages;
    }
  }
}
