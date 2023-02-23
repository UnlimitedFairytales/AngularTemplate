import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { AppObject } from "../helpers/app-object";
import { defineLocale, jaLocale, koLocale, thLocale, zhCnLocale } from 'ngx-bootstrap/chronos';

export class AppBsDatepickerConfig {

  protected static configBase: BsDatepickerConfig;

  /**
   * static constructor
   */
  static staticInitialize() {
    defineLocale('th', thLocale);
    defineLocale('zh-cn', zhCnLocale);
    defineLocale('ko', koLocale);
    defineLocale('ja', jaLocale);

    const c = new BsDatepickerConfig();
    c.adaptivePosition = true;
    c.containerClass = 'theme-dark-blue';
    c.showClearButton = true;
    c.showWeekNumbers = false;
    AppBsDatepickerConfig.configBase = c;
    console.log('AppBsDatepicker.staticInitialize() called');
  }

  /**
   * BsLocaleService.use()に渡す値に変換する
   * @param l AppLocaleServiceが使用するlocale値
   * @returns 
   */
  static toBsLocaleServiceLocale(l: string) {
    const lower = l.toLocaleLowerCase();
    switch (lower) {
      case 'en-us':
        return 'en';
      case 'th-th':
        return 'th';
      case 'zh-cn':
        return 'zh-cn';
      case 'ko-kr':
        return 'ko';
      case 'ja-jp':
      default:
        return 'ja';
    }
  }

  /**
   * 日付選択のためのBsDatepickerConfigひな型を取得する
   * @returns 
   */
  static getConfigBase_Day(): BsDatepickerConfig {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = AppObject.clone(AppBsDatepickerConfig.configBase)!;
    result.dateInputFormat = 'YYYY-MM-DD';
    result.minMode = 'day';
    result.startView = 'day';
    return result;
  }
  
  /**
   * 月選択のためのBsDatepickerConfigひな型を取得する
   * @returns 
   */
  static getConfigBase_Month(): BsDatepickerConfig {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = AppObject.clone(AppBsDatepickerConfig.configBase)!;
    result.dateInputFormat = 'YYYY-MM';
    result.minMode = 'month';
    result.startView = 'month';
    return result;
  }

  /**
   * 年選択のためのBsDatepickerConfigひな型を取得する
   * @returns 
   */
  static getConfigBase_Year(): BsDatepickerConfig {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = AppObject.clone(AppBsDatepickerConfig.configBase)!;
    result.dateInputFormat = 'YYYY';
    result.minMode = 'year';
    result.startView = 'year';
    return result;
  }
}
AppBsDatepickerConfig.staticInitialize();