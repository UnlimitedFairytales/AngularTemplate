import { Pipe, PipeTransform } from '@angular/core';
import { AppLocaleService } from 'src/app/shared-p/locale/app-locale.service';

@Pipe({
  name: 'appLocaleText'
})
export class AppLocaleTextPipe implements PipeTransform {

  constructor(protected appLocaleService: AppLocaleService) { }

  /* implements PipeTransform */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, ...args: unknown[]): string {
    if ((typeof value) !== 'string') return '';

    return this.appLocaleService.getLocaleText(value as string);
  }
}