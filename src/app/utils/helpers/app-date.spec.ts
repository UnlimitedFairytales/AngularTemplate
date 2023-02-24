import { AppDate } from './app-date';

/*
|Assert          |xUnit.net               |Jasmine                    |
|----------------|------------------------|---------------------------|
|ルーズな比較    |Assert.Equal(exp, act)  |expect(act).toEqual(exp)   |
|参照の比較      |Assert.Same(exp, act)   |expect(act).toBe(exp)      |
|参照の比較(否定)|Assert.NotSame(exp, act)|expect(act).not.toBe(exp)  |
|例外発生        |Assert.Throws<T>(code)  |expect(foo).toThrowError(T)|
*/
describe('app-date ※ テストをパスするには、PCのロケールを日本にする必要がある', () => {
  // common arrange
  beforeEach(() => { console.log('ここに書いた内容は各itで毎回実行されます。') });

  it('1. toYYYYMMDD, toYYYYMM, toYYYY', () => {
    // 基本動作
    expect(AppDate.toYYYYMMDD(new Date('0001-01-01T00:00:00'))).toEqual('00010101');
    expect(AppDate.toYYYYMMDD(new Date('2023-12-31T00:00:00'))).toEqual('20231231');
    expect(AppDate.toYYYYMMDD(new Date(NaN))).toEqual(undefined);
    // ローカル
    expect(AppDate.toYYYYMMDD(new Date('2023-02-03T14:59:59.999+09:00'))).toEqual('20230203');
    expect(AppDate.toYYYYMMDD(new Date('2023-02-03T15:00:00.000+09:00'))).toEqual('20230203');
    // UTC
    expect(AppDate.toYYYYMMDD(new Date('2023-02-03T14:59:59.999Z'))).toEqual('20230203');
    expect(AppDate.toYYYYMMDD(new Date('2023-02-03T15:00:00.000Z'))).toEqual('20230204');
    // 本初子午線経度計算方及標準時ノ件：明治21年
    // 1887年以前：日本-東京地方時(+9:18)
    expect(AppDate.toYYYYMMDD(new Date('1887-12-31T14:41:00.999Z'))).toEqual('18871231');
    expect(AppDate.toYYYYMMDD(new Date('1887-12-31T14:41:01.000Z'))).toEqual('18880101');
    // 1888年以降：日本標準時(+9:00)
    expect(AppDate.toYYYYMMDD(new Date('1888-01-01T14:59:59.999Z'))).toEqual('18880101');
    expect(AppDate.toYYYYMMDD(new Date('1888-01-01T15:00:00.000Z'))).toEqual('18880102');
    expect((new Date(1888, 0, 1, 0, 18, 59, 0)).getTime() - (new Date(1888, 0, 1, 0, 18, 58, 999)).getTime()).toEqual(1139001); // 18分59秒 + 1ミリ
    // toYYYYMM
    expect(AppDate.toYYYYMM(new Date('2023-01-31T14:59:59.000Z'))).toEqual('202301');
    expect(AppDate.toYYYYMM(new Date('2023-01-31T15:00:00.000Z'))).toEqual('202302');
    // toYYYY
    expect(AppDate.toYYYY(new Date('2022-12-31T14:59:59.000Z'))).toEqual('2022');
    expect(AppDate.toYYYY(new Date('2022-12-31T15:00:00.000Z'))).toEqual('2023');
  });

  it('2. clamp', () => {
    expect(AppDate.toYYYYMMDD(AppDate.clamp(new Date('0000-01-01T00:00:00.000+09:00')))).toEqual('19000101');
    expect(AppDate.toYYYYMMDD(AppDate.clamp(new Date('0000-01-01T00:00:00.000+09:00'), new Date('2000-10-01')))).toEqual('20001001');
    expect(AppDate.toYYYYMMDD(AppDate.clamp(new Date('0000-01-01T00:00:00.000+09:00'), undefined, new Date('2000-10-01')))).toEqual('19000101');
    expect(AppDate.toYYYYMMDD(AppDate.clamp(new Date('9999-01-01T00:00:00.000+09:00')))).toEqual('29991231');
    expect(AppDate.toYYYYMMDD(AppDate.clamp(new Date('9999-01-01T00:00:00.000+09:00'), new Date('2000-10-01')))).toEqual('29991231');
    expect(AppDate.toYYYYMMDD(AppDate.clamp(new Date('9999-01-01T00:00:00.000+09:00'), undefined, new Date('2000-11-01')))).toEqual('20001101');
  });

  it('3. toIso8601ExString', () => {
    expect(AppDate.toIso8601ExString('00000101')).toEqual('0000-01-01T00:00:00');
    expect(AppDate.toIso8601ExString('99991231')).toEqual('9999-12-31T00:00:00');
    expect(AppDate.toIso8601ExString('invalid')).toEqual(undefined);
    expect(AppDate.toIso8601ExString('20001301')).toEqual(undefined);
    expect(AppDate.toIso8601ExString('20000231')).toEqual('2000-02-31T00:00:00');
    expect(AppDate.toIso8601ExString('20000232')).toEqual(undefined);
  });

  it('4. toDate', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(AppDate.toYYYYMMDD(AppDate.toDate('00000101')!)).toEqual('00000101');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(AppDate.toYYYYMMDD(AppDate.toDate('99991231')!)).toEqual('99991231');
    expect(AppDate.toDate('invalid')).toEqual(undefined);
    expect(AppDate.toDate('20001301')).toEqual(undefined);
    expect(AppDate.toDate('20000231')).toEqual(new Date(2000, 3 - 1, 2));
    expect(AppDate.toDate('20000232')).toEqual(undefined);
  });

  it('5. toClampedDate', () => {
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('00000101'))).toEqual('19000101');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('00000101', new Date('2000-10-01')))).toEqual('20001001');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('00000101', undefined, new Date('2000-10-01')))).toEqual('19000101');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('99990101'))).toEqual('29991231');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('99990101', new Date('2000-10-01')))).toEqual('29991231');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('99990101', undefined, new Date('2000-11-01')))).toEqual('20001101');

    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('invalid'))).toEqual('19000101');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('invalid', new Date('2000-10-01')))).toEqual('20001001');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('invalid', new Date('0001-01-01')))).toEqual('00010101');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('20001301'))).toEqual('19000101');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('20000231'))).toEqual('20000302');
    expect(AppDate.toYYYYMMDD(AppDate.toClampedDate('20000232'))).toEqual('19000101');
  });
  it('6. isYYYYMMDDLike', () => {
    expect(AppDate.isYYYYMMDDLike(undefined, 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike(undefined, 'anything', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(null, 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike(null, 'anything', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('', 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('', 'anything', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(' ', 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike(' ', 'anything', false)).toBeFalse();

    expect(AppDate.isYYYYMMDDLike(0, 'anything', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(0, 'anything', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(20001231, 'anything', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(20001231, 'anything', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(true, 'anything', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike(false, 'anything', false)).toBeFalse();

    expect(AppDate.isYYYYMMDDLike('20231231', 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('20231231', 'anything', false)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('202312', 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('202312', 'anything', false)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('2023', 'anything', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('2023', 'anything', false)).toBeTrue();

    expect(AppDate.isYYYYMMDDLike('20231231', 'yyyyMMdd', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('20231231', 'yyyyMMdd', false)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('202312', 'yyyyMMdd', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('202312', 'yyyyMMdd', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('2023', 'yyyyMMdd', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('2023', 'yyyyMMdd', false)).toBeFalse();

    expect(AppDate.isYYYYMMDDLike('20231231', 'yyyyMM', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('20231231', 'yyyyMM', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('202312', 'yyyyMM', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('202312', 'yyyyMM', false)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('2023', 'yyyyMM', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('2023', 'yyyyMM', false)).toBeFalse();

    expect(AppDate.isYYYYMMDDLike('20231231', 'yyyy', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('20231231', 'yyyy', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('202312', 'yyyy', true)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('202312', 'yyyy', false)).toBeFalse();
    expect(AppDate.isYYYYMMDDLike('2023', 'yyyy', true)).toBeTrue();
    expect(AppDate.isYYYYMMDDLike('2023', 'yyyy', false)).toBeTrue();

  });
});

// luxon注意点(現状未使用)
// 1. js標準Dateとluxonは、Asia/Tokyoの1887年以前の時差が異なる（js標準Dateは+9:18:59、luxonは+9:18）
// 2. js標準Dateで直接local時刻を作成する関数を使用した場合、境界はnew Date(1888, 0, 1, 0, 18, 59, 0)
// 3. luxonで直接local時刻を作成する関数を使用した場合、境界はDateTime.local(1888, 1, 1, 0, 0, 0, 0)
