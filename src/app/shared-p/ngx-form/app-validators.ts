import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AppObject } from 'src/app/utils/helpers/app-object';
import { AppMessageBoxService } from '../bs-wrapper/app-message-box.service';
import { AppLocaleService } from '../locale/app-locale.service';

// https://angular.jp/api/forms/Validators
// https://angular.jp/guide/form-validation#カスタムバリデーター
@Injectable()
export class AppValidators {

  private static errorsWithMessage(errors: ValidationErrors | null, message: string): ValidationErrors | null {
    if (errors === null) return null;
    return { error: { original: errors, message: message } }
  }

  /**
   * Validators.min に対応。※Validators.minは、htmlのmin属性に対応しておりtype=number等を前提としているため、type=textで数値ではない値を入力してもerrorとして扱わない
   */
  static min(message: string, min: number): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.min(min)(c), message);
  }
  /**
   * Validators.max に対応。※Validators.maxは、htmlのmax属性に対応しておりtype=number等を前提としているため、type=textで数値ではない値を入力してもerrorとして扱わない
   */
  static max(message: string, max: number): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.max(max)(c), message);
  }
  /**
   * Validators.required に対応
   */
  static required(message: string): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.required(c), message);
  }
  /**
   * Validators.email に対応
   */
  static email(message: string): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.email(c), message);
  }
  /**
   * Validators.minLength に対応
   */
  static minLength(message: string, minLength: number): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.minLength(minLength)(c), message);
  }
  /**
   * Validators.maxLength に対応
   */
  static maxLength(message: string, maxLength: number): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.maxLength(maxLength)(c), message);
  }
  /**
   * Validators.pattern に対応
   */
  static pattern(message: string, pattern: string | RegExp): ValidatorFn {
    return (c) => AppValidators.errorsWithMessage(Validators.pattern(pattern)(c), message);
  }
  /**
   * NaNではないJavascript numberかどうか
   * @param message invalid時に表示するメッセージ
   * @returns ValidatorFn
   */
  static number(message: string): ValidatorFn {
    return (c) => {
      if (AppObject.isNullish(c.value)) return null;
      const casted = Number(c.value);
      if (!Number.isNaN(casted)) {
        return null;
      }
      return { error: { original: null, message: message } }
    };
  }
  /**
   * 整数かどうか
   * @param message invalid時に表示するメッセージ
   * @returns ValidatorFn
   */
  static integer(message: string): ValidatorFn {
    return (c) => {
      if (AppObject.isNullish(c.value)) return null;
      const casted = Number(c.value);
      if (Number.isInteger(casted)) {
        return null;
      }
      return { error: { original: null, message: message } }
    };
  }
  /**
   * 非負整数かどうか
   * @param message invalid時に表示するメッセージ
   * @returns ValidatorFn
   */
  static nonNegativeInteger(message: string): ValidatorFn {
    return (c) => {
      if (AppObject.isNullish(c.value)) return null;
      const casted = Number(c.value);
      if (Number.isInteger(casted) && 0 <= casted) {
        return null;
      }
      return { error: { original: null, message: message } };
    };
  }
  /**
   * 電話番号かどうか
   * @param message invalid時に表示するメッセージ
   * @returns ValidatorFn
   */
  static telephone(message: string): ValidatorFn {
    return (c) => {
      if (AppObject.isNullish(c.value)) return null;
      const casted = String(c.value);
      if (casted === '') return null;
      if (/^\d{0,3}-?\d{1,5}-\d{1,5}-\d{1,5}$/.test(casted) && 12 <= casted.length && casted.length <= 18) {
        return null;
      }
      return { error: { original: null, message: message } }
    };
  }
  /**
   * 任意の検証内容
   * @param fn 検証内容。invalid時にはメッセージを返し、valid時にはnullを返す
   * @returns ValidatorFn
   */
  static other(fn: (control: AbstractControl) => null | string): ValidatorFn {
    return (c) => {
      const msg = fn(c);
      return msg ? { error: { original: null, message: msg } } : null;
    };
  }

  // static
  //----------------------------------------------------------------------------
  // instance

  constructor(
    protected appMessageBoxService: AppMessageBoxService,
    protected appLocaleService: AppLocaleService) { }

  /**
   * Form内にinvalidな内容があるかどうか検証します
   * @param formGroupList 検証対象
   * @returns (awaitable) invalidがあるかどうか
   */
  async hasErrorAsync(...formGroupList: FormGroup[]): Promise<boolean> {
    const result = this.hasErrorInner(formGroupList);
    if (result) {
      const msg = this.appLocaleService.getLocaleMessage('W2000');
      await this.appMessageBoxService.showAsync(msg, undefined, [{ name: 'OK', cssClass: 'btn-cta' }]);
    }
    return result;
  }

  protected hasErrorInner(formGroupList: FormGroup[]): boolean {
    let result = false;
    for (const formGroup of formGroupList) {
      for (const key in formGroup.controls) {
        const ctl = formGroup.controls[key];
        if (ctl instanceof FormGroup) {
          result = this.hasErrorInner([ctl]) || result;
        } else if (ctl instanceof FormArray) {
          for (const c of ctl.controls) {
            result = this.markAndValidate(c) || result;
          }
        } else {
          result = this.markAndValidate(ctl) || result;
        }
      }
    }
    return result;
  }

  protected markAndValidate(ctl: AbstractControl): boolean {
    ctl.markAsDirty();
    ctl.updateValueAndValidity({ emitEvent: false });
    return ctl.invalid;
  }
}
