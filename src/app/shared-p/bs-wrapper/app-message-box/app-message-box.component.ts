import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppMessageBoxButton, AppMessageBoxDoneFunc } from '../app-message-box.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './app-message-box.component.html',
  styleUrls: ['./app-message-box.component.scss']
})
export class AppMessageBoxComponent {

  // Set via initialState
  // https://valor-software.com/ngx-bootstrap/#/components/modals?tab=overview
  text?: string;
  caption?: string;
  buttons: AppMessageBoxButton[] = [{ name: 'OK', cssClass: 'btn-cta' }];
  done?: AppMessageBoxDoneFunc;

  constructor(protected bsModalRef: BsModalRef) { }

  convertCss(cssClass?: string): string {
    if (cssClass?.length) {
      return 'btn ' + cssClass;
    } else {
      return 'btn btn-default';
    }
  }

  close(button?: AppMessageBoxButton) {
    const result = button ? this.buttons.indexOf(button) : undefined;
    console.log(`AppMessageBoxComponent result is ${result ?? 'undefined'}`);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.done!(result);
    this.bsModalRef.hide();
  }
}
