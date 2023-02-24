import { AppObject } from './app-object';

/*
|Assert          |xUnit.net               |Jasmine                    |
|----------------|------------------------|---------------------------|
|ルーズな比較    |Assert.Equal(exp, act)  |expect(act).toEqual(exp)   |
|参照の比較      |Assert.Same(exp, act)   |expect(act).toBe(exp)      |
|参照の比較(否定)|Assert.NotSame(exp, act)|expect(act).not.toBe(exp)  |
|例外発生        |Assert.Throws<T>(code)  |expect(foo).toThrowError(T)|
*/
describe('app-object', () => {
  // common arrange
  beforeEach(() => { console.log('ここに書いた内容は各itで毎回実行されます。') });

  it('1. removeNullish', () => {
    { // 単純なケース
      // arrange
      const original = { foo: false, bar: null, baz: 0, qux: undefined, quux: '' };
      const expected = { foo: false, baz: 0, quux: '' };
      // act
      const actual = AppObject.removeNullish(original);
      // assert
      expect(actual).not.toEqual(original);
      expect(actual).toEqual(expected);
    }
    { // 配列
      // arrange
      const original = [10, null, 30, undefined, 50];
      const expected = [10, 30, 50];
      // act
      const actual = AppObject.removeNullish(original);
      // assert
      expect(actual).not.toEqual(original);
      expect(actual).toEqual(expected);
    }
    { // 複雑なケース
      // arrange
      const original = { root: { foo: false, bar: null, baz: 0, qux: undefined, quux: '', sub: [{ hoge: 12, fuga: null }, { hoge: 4, fuga: '' }, {}] } };
      const expected = { root: { foo: false, baz: 0, quux: '', sub: [{ hoge: 12 }, { hoge: 4, fuga: '' }, {}] } };
      // act
      const actual = AppObject.removeNullish(original);
      // assert
      expect(actual).not.toEqual(original);
      expect(actual).toEqual(expected);
    }
  });

  it('2. clone', () => {
    { // clone number
      // arrange
      const original = 12;
      const expected = 12;
      // act
      const actual = AppObject.clone(original);
      // assert
      expect(actual).toEqual(original);
      expect(actual).toEqual(expected);
    }
    { // clone object
      // arrange
      const original = { foo: false, bar: null, baz: 0, qux: undefined, quux: '' };
      const expected = { foo: false, bar: null, baz: 0, quux: '' }; // undefinedは消える
      // act
      const actual = AppObject.clone<unknown>(original);
      // assert
      expect(actual).not.toBe(original);
      expect(actual).toEqual(expected);
    }
  });
  it('3. toBase64, fromBase64', () => {
    // string
    expect(AppObject.toBase64('✓ à la mode')).toEqual('4pyTIMOgIGxhIG1vZGU=');
    expect(AppObject.fromBase64('4pyTIMOgIGxhIG1vZGU=')).toEqual('✓ à la mode');
    // object
    const obj1 = { str: '✓ à la mode' };
    expect(AppObject.toBase64(obj1)).toEqual('eyJzdHIiOiLinJMgw6AgbGEgbW9kZSJ9');
    expect(AppObject.fromBase64('eyJzdHIiOiLinJMgw6AgbGEgbW9kZSJ9')).toEqual(obj1);
    // JSON string
    expect(AppObject.toBase64('{ "str" : "✓ à la mode" }')).toEqual('eyAic3RyIiA6ICLinJMgw6AgbGEgbW9kZSIgfQ==');
    expect(AppObject.fromBase64('eyAic3RyIiA6ICLinJMgw6AgbGEgbW9kZSIgfQ==')).toEqual(obj1);
    // object with undefined
    const obj2 = { str: '✓ à la mode', foo: undefined };
    expect(AppObject.toBase64(obj2)).toEqual('eyJzdHIiOiLinJMgw6AgbGEgbW9kZSJ9');
    expect(AppObject.fromBase64('eyJzdHIiOiLinJMgw6AgbGEgbW9kZSJ9')).toEqual(obj1); // undefinedメンバは除去される
  });
});
