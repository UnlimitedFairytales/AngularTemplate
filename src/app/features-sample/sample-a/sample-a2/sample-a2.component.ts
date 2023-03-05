import { Component } from '@angular/core';
import { from, lastValueFrom, timeout } from 'rxjs';
import { AppAjaxService } from 'src/app/shared-p/ngx-http/app-ajax.service';

@Component({
  selector: 'app-sample-a2',
  templateUrl: './sample-a2.component.html',
  styleUrls: ['./sample-a2.component.scss']
})
export class SampleA2Component {

  constructor(private appAjaxService: AppAjaxService) { }

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

  async xhrGet_clickAsync(): Promise<void> {
    // このエンドポイントはCORSが許可されているので、CORSエラーにならない
    const url = 'https://jsonplaceholder.typicode.com/albums';
    const result = await this.appAjaxService.getAsync(url);
    console.log(result);
  }

  async xhrPost_clickAsync(): Promise<void> {
    // このエンドポイントはCORSが許可されているので、CORSエラーにならない
    const url = 'https://jsonplaceholder.typicode.com/albums';
    const body = {
      "userId": 1,
      "title": "POST TEST!"
    };
    const result = await this.appAjaxService.postAsync(url, body);
    console.log(result);
  }
}
