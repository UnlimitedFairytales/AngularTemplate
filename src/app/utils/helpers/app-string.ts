export class AppString {
  /**
   * undefined, null, trim()後'', のいずれかに当てはまるか
   * @param str 文字列
   * @returns 
   */
  static isNullishOrWhitespace(str: string | undefined | null): boolean {
    return (str === undefined || str === null || str.trim() === '');
  }
}