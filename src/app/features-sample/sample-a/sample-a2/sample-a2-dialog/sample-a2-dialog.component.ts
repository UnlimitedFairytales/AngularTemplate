import { Component } from '@angular/core';
import { AppModalComponent, AppModalDoneFunc } from 'src/app/shared-p/bs-wrapper/app-modal-component';

@Component({
  selector: 'app-sample-a2-dialog',
  templateUrl: './sample-a2-dialog.component.html',
  styleUrls: ['./sample-a2-dialog.component.scss']
})
export class SampleA2DialogComponent implements AppModalComponent<unknown, string> {

  /* implements AppModalComponent<TInitialData, TResultData> */
  initialData?: { value: string } = { value: "don't assigned" };
  /* implements AppModalComponent<TInitialData, TResultData> */
  done?: AppModalDoneFunc<string>;

  ok_click(): void {
    console.log(this.initialData);
    if (this.done) {
      this.done({ isCanceled: false, resultData: 'ok' });
    }
  }
}