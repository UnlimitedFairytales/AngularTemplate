import { AppString } from './app-string';
import { AppObject } from './app-object';

export class AppDate {

  /**
   * ローカル基準で変換する。Invalid Dateの場合はundefinedが返る
   * @param date 日付
   * @returns 
   */
  static toYYYYMMDD(date: Date): string | undefined {
    if (date.toString() === 'Invalid Date') {
      return undefined;
    }
    const yyyy = date.getFullYear().toString().padStart(4, '0');
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return yyyy + MM + dd;
  }

  /**
   * ローカル基準で変換する。Invalid Dateの場合はundefinedが返る
   * @param date 日付
   * @returns 
   */
  static toYYYYMM(date: Date): string | undefined { return AppDate.toYYYYMMDD(date)?.substring(0, 6); }

  /**
   * ローカル基準で変換する。Invalid Dateの場合はundefinedが返る
   * @param date 日付
   * @returns 
   */
  static toYYYY(date: Date): string | undefined { return AppDate.toYYYYMMDD(date)?.substring(0, 4); }

  /**
   * 初期値は1900-01-01T00:00:00.000（注意：4Byte系のTimestampの範囲外）
   */
  static DefaultMinDate = new Date('1900-01-01T00:00:00.000');

  /**
   * 初期値は2999-12-31T23:59:59.999（注意：4Byte系のTimestampの範囲外）
   */
  static DefaultMaxDate = new Date('2999-12-31T23:59:59.999');

  /**
   * min以上max以下の範囲に限定する
   * @param date 元の値
   * @param minDate 最小値。省略した場合はAppDate.DefaultMinDate
   * @param maxDate 最大値。省略した場合はAppDate.DefaultMaxDate
   * @returns 
   */
  static clamp(date: Date, minDate?: Date, maxDate?: Date): Date {
    minDate = minDate ?? AppDate.DefaultMinDate;
    maxDate = maxDate ?? AppDate.DefaultMaxDate;
    if (date <= minDate) return new Date(minDate);
    if (maxDate <= date) return new Date(maxDate);
    return date;
  }

  /**
   * yyyyMMdd形式をyyyy-MM-ddT00:00:00に変換する。不正な形式の場合undefinedが返る
   * @param yyyyMMdd yyyyMMdd形式の文字列
   */
  static toIso8601ExString(yyyyMMdd: string): string | undefined {
    if (yyyyMMdd.length < 8) {
      return undefined;
    }
    const str = yyyyMMdd.substring(0, 4) + '-' + yyyyMMdd.substring(4, 6) + '-' + yyyyMMdd.substring(6, 8) + 'T00:00:00';
    const converted = new Date(str);
    if (converted.toString() === 'Invalid Date') {
      return undefined;
    }
    return str;
  }

  /**
   * ローカル基準でDateに変換する。変換できない場合はundefinedが返る
   * @param yyyyMMdd yyyyMMdd形式の文字列
   * @returns 
   */
  static toDate(yyyyMMdd: string): Date | undefined {
    const isoString = AppDate.toIso8601ExString(yyyyMMdd);
    if (isoString === undefined) {
      return undefined;
    }
    return new Date(isoString);
  }

  /**
   * Dateに変換してmin以上max以下の範囲に限定する。不正な値だった場合はminDateになる
   * @param yyyyMMdd yyyyMMdd形式の文字列
   * @returns 
   */
  static toClampedDate(yyyyMMdd: string, minDate?: Date, maxDate?: Date) {
    let result = AppDate.toDate(yyyyMMdd);
    if (result === undefined) {
      result = minDate ?? AppDate.DefaultMinDate;
    }
    return AppDate.clamp(result, minDate, maxDate);
  }

  /**
   * yyyyMMddなどの形式の文字列か
   * @param value 検証する値
   * @param validateMode どの形式として検証するか。'anything'は'yyyyMMdd', 'yyyyMM', 'yyyy'形式のいずれでもtrueを返す
   * @param allowsNullOrWhitespace null, undefined, 空文字の場合にtrueを返すか
   * @returns 
   */
  static isYYYYMMDDLike(value: unknown, validateMode: 'yyyyMMdd' | 'yyyyMM' | 'yyyy' | 'anything' = 'anything', allowsNullOrWhitespace = true): boolean {
    if (AppObject.isNullish(value)) return allowsNullOrWhitespace;
    if (typeof value !== 'string') return false;
    if (AppString.isNullishOrWhitespace(value)) return allowsNullOrWhitespace;
    if (validateMode === 'yyyyMM' && value.length !== 6) return false;
    if (validateMode === 'yyyy' && value.length !== 4) return false;

    let v = value;
    if ((validateMode === 'anything' || validateMode === 'yyyyMM') && value.length === 6) {
      v = value + '01';
    }
    if ((validateMode === 'anything' || validateMode === 'yyyy') && value.length === 4) {
      v = value + '0101';
    }
    return AppDate.toDate(v) !== undefined;
  }
}