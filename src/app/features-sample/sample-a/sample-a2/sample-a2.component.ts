import { Component } from '@angular/core';
import { from, lastValueFrom, timeout } from 'rxjs';

@Component({
  selector: 'app-sample-a2',
  templateUrl: './sample-a2.component.html',
  styleUrls: ['./sample-a2.component.scss']
})
export class SampleA2Component {

  throwError_click(): void {
    throw new Error('Error example.');
  }

  throwTimeoutErrorViaObservable_click(): void {
    const delay3sec = new Promise((resolve) => setTimeout(resolve, 3 * 1000));
    const src$ = from(delay3sec).pipe(timeout(0.5 * 1000));
    src$.subscribe(() => console.log('foo'));
  }

  async throwTimeoutErrorViaPromise_clickAsync(): Promise<void> {
    const delay3sec = new Promise((resolve) => setTimeout(resolve, 3 * 1000));
    const src$ = from(delay3sec).pipe(timeout(0.5 * 1000));
    await lastValueFrom(src$);
  }
}
