import { Injectable } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AppMessageBoxComponent } from './app-message-box/app-message-box.component';
import { AppObject } from 'src/app/utils/helpers/app-object';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type AppMessageBoxButton = { name: string, cssClass?: string }
export type AppMessageBoxDoneFunc = (value: number | PromiseLike<number | undefined> | undefined) => void; // Promise<number | undefined>'s resolve

@Injectable()
export class AppMessageBoxService {

  constructor(protected bsModalService: BsModalService) { }

  /**
   * モーダルなメッセージを表示します
   * @param text !!!CAUTION!!! InnerHTMLが使われています。固定内容のみ指定してください
   * @param caption 省略可能
   * @param buttons 省略可能
   * @returns (awaitable) buttonsのindexまたはundefined
   */
  async showAsync(
    text?: string,
    caption?: string,
    buttons?: AppMessageBoxButton[]): Promise<number | undefined> {

    const promise = new Promise<number | undefined>((resolve) => {
      // ModalOption.initialState は Templateの同名のプロパティを上書き初期化する
      // undefinedでも上書き初期化してしまうため、上書き初期化したくない場合はプロパティ自体の削除が必要になる
      const nullRemoved = AppObject.removeNullish({
        text: text,
        caption: caption,
        buttons: buttons,
      });
      const initialState = Object.assign({ done: resolve }, nullRemoved);
      const options: ModalOptions = {
        animated: true,
        backdrop: 'static',
        initialState: initialState,
        keyboard: false,
      };
      this.bsModalService.show(AppMessageBoxComponent, options);
    });
    return promise;
  }
}
