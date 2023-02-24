import { AppRegExp } from './app-regexp';

/*
|Assert          |xUnit.net               |Jasmine                    |
|----------------|------------------------|---------------------------|
|ルーズな比較    |Assert.Equal(exp, act)  |expect(act).toEqual(exp)   |
|参照の比較      |Assert.Same(exp, act)   |expect(act).toBe(exp)      |
|参照の比較(否定)|Assert.NotSame(exp, act)|expect(act).not.toBe(exp)  |
|例外発生        |Assert.Throws<T>(code)  |expect(foo).toThrowError(T)|
*/
describe('app-regexp', () => {
  // common arrange
  beforeEach(() => { console.log('ここに書いた内容は各itで毎回実行されます。') });

  it('1. INTEGER (-はOK、+記号はNG)', () => {
    expect(new RegExp(AppRegExp.patterns.INTEGER).test('129103')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.INTEGER).test('-23123')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.INTEGER).test('+23123')).toBeFalse();
    expect(new RegExp(AppRegExp.patterns.INTEGER).test('aaaaaa')).toBeFalse();
    expect(new RegExp(AppRegExp.patterns.INTEGER).test('023123')).toBeFalse();
  });

  it('2. WORD 0azAZ_abc9', () => {
    expect(new RegExp(AppRegExp.patterns.WORD).test('0azAZ_abc9')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.WORD).test('-')).toBeFalse();
  });

  it('3. KATA アオワヰウヱヲンーァォャュョガポヴｱｵﾜｦﾝﾞﾟ-', () => {
    expect(new RegExp(AppRegExp.patterns.KATA).test('アオワヰウヱヲンー')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.KATA).test('ァォャュョガポヴ')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.KATA).test('あいうえお')).toBeFalse();
    expect(new RegExp(AppRegExp.patterns.KATA).test('ｱｵﾜｦﾝﾞﾟ-')).toBeTrue();
  });

  it('4. HIRA あおわゐうゑをんーぁぉゃゅょがぽぶ', () => {
    expect(new RegExp(AppRegExp.patterns.HIRA).test('あおわゐうゑをんー')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.HIRA).test('ぁぉゃゅょがぽぶ')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.HIRA).test('アイウエオ')).toBeFalse();
  });

  it('5. WORD_SPACE 0azAZ _abc9       ', () => {
    expect(new RegExp(AppRegExp.patterns.WORD_SPACE).test('0azAZ _abc9')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.WORD_SPACE).test('-')).toBeFalse();
  });

  it('6. KATA_SPACE ア　オ ワヰウヱヲンーァォャュョガポヴｱｵﾜｦﾝﾞﾟ-', () => {
    expect(new RegExp(AppRegExp.patterns.KATA_SPACE).test('ア　オ ワヰウヱヲンー')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.KATA_SPACE).test('ァォャュョガポヴ')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.KATA_SPACE).test('あいうえお')).toBeFalse();
    expect(new RegExp(AppRegExp.patterns.KATA_SPACE).test('ｱｵﾜｦﾝﾞﾟ-')).toBeTrue();
  });

  it('7. HIRA_SPACE あ　お わゐうゑをんーぁぉゃゅょがぽぶ', () => {
    expect(new RegExp(AppRegExp.patterns.HIRA_SPACE).test('あ　お わゐうゑをんー')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.HIRA_SPACE).test('ぁぉゃゅょがぽぶ')).toBeTrue();
    expect(new RegExp(AppRegExp.patterns.HIRA_SPACE).test('アイウエオ')).toBeFalse();
  });
});