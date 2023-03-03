import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  /* implements ErrorHandler */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any): void {
    if (error.promise && error.rejection) {
      console.log(error);
      error = error.rejection;
    }

    console.error(error);
    console.log('Please write error handling logic.');
  }
}