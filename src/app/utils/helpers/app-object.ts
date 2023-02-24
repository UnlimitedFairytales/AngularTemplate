export class AppObject {

  /**
   * nullかundefinedであるか（type guard）
   * @param v 検査対象
   * @returns 
   */
  static isNullish<T>(v: T | null | undefined): v is null | undefined {
    return v === null || v === undefined;
  }

  /**
   * 非null objectか（type guard）
   * @param v 検査対象
   * @returns 
   */
  static isObject(v: unknown | null | undefined): v is object {
    return v !== null && typeof v === 'object';
  }

  /**
   * 元のobjectからnullやundefinedなプロパティを除去したobjectを生成する  
   * objectリテラルの加工を目的としており、prototypeや列挙不可能メンバも除去される  
   * functionを直接渡すとTypeErrorをthrowする
   * @param obj 元のオブジェクト
   * @returns 
   */
  static removeNullish = function (obj: unknown) {
    if (typeof obj === 'function') throw TypeError("Argument is function");
    if (AppObject.isNullish(obj)) return undefined;
    if (!AppObject.isObject(obj)) return obj;
    return AppObject._removeNullish(obj);
  }

  private static _removeNullish(obj: object): object {
    if (Array.isArray(obj)) {
      const unknownList = obj as unknown[];
      const result: unknown[] = [];
      for (const v of unknownList) {
        if (AppObject.isNullish(v)) continue;
        if (AppObject.isObject(v)) {
          const removed = AppObject._removeNullish(v);
          result.push(removed);
        } else {
          result.push(v);
        }
      }
      return result;
    }
    return Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, v]) => !AppObject.isNullish(v))
      .reduce(
        (accumulator, [k, v]) => {
          let casted = v as unknown;
          if (AppObject.isObject(casted)) {
            casted = AppObject._removeNullish(casted);
          }
          return { ...accumulator, [k]: casted };
        },
        {}
      );
  }

  /**
   * 両者をJSON.stringifyしてから比較する
   * ※ undefinedなメンバは無視される
   * @param obj1 比較対象1
   * @param obj2 比較対象2
   * @returns 
   */
  static stringifyEquals = function (obj1: unknown, obj2: unknown) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * JSON.stringifyしてJSON.parseする
   * ※ undefinedなメンバは消滅する
   * @returns 
   */
  static clone<T>(obj: T): T | undefined {
    if (AppObject.isNullish(obj)) return undefined;
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  /**
   * base64に変換する  
   * 引数がobjectの場合、JSON.stringifyしてからbase64に変換する  
   * null, undefinedはencodeURIComponentによって'null', 'undefined'になる
   * @param value 任意の値
   * @returns 
   */
  static toBase64(value: unknown): string {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return window.btoa(unescape(encodeURIComponent(value)));
    }
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(value))));
  }

  /**
   * toBase64と逆の操作をする  
   * toBase64変換前の値がstring, number, booleanの時、JSON文字列でなければそれらの値を戻す  
   * toBase64変換前の値がそれら以外の場合、objectを戻す
   * @param str Base64文字列
   * @returns 
   */
  public static fromBase64(str: string): unknown {
    const decoded = decodeURIComponent(escape(window.atob(str)));
    if (decoded.startsWith('{') && decoded.endsWith('}')) {
      try {
        return JSON.parse(decoded);
      } catch { /* empty */ }
    }
    return decoded;
  }
}