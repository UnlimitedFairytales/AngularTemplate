import { Injectable, Type } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { AppModalComponent, AppModalResult } from './app-modal-component';

@Injectable()
export class AppModalService {

  constructor(protected bsModalService: BsModalService) { }

  /**
   * モーダルなダイアログを表示します
   * @param component 表示するComponentの型
   * @param initialData 省略可能。渡す値
   * @param modalOptions 省略可能
   * @returns (awaitable) AppModalResult
   */
  async showAsync<TInitialData, TResultData>(
    component: Type<AppModalComponent<TInitialData, TResultData>>,
    initialData?: TInitialData,
    modalOptions?: ModalOptions): Promise<AppModalResult<TResultData>> {

    let modalRef: BsModalRef;
    const promise = new Promise<AppModalResult<TResultData>>((resolve) => {
      const initialState = {
        initialData: initialData,
        done: (result: AppModalResult<TResultData>) => {
          resolve(result);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          modalRef!.hide();
        }
      };
      const options: ModalOptions = Object.assign(
        {
          animated: true,
          backdrop: 'static',
          initialState: initialState,
          keyboard: false,
        },
        modalOptions);
      modalRef = this.bsModalService.show(component, options);
    });
    return promise;
  }
}