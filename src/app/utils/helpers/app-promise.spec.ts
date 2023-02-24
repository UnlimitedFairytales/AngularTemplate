import { AppPromise } from './app-promise';

/*
|Assert          |xUnit.net               |Jasmine                    |
|----------------|------------------------|---------------------------|
|ルーズな比較    |Assert.Equal(exp, act)  |expect(act).toEqual(exp)   |
|参照の比較      |Assert.Same(exp, act)   |expect(act).toBe(exp)      |
|参照の比較(否定)|Assert.NotSame(exp, act)|expect(act).not.toBe(exp)  |
|例外発生        |Assert.Throws<T>(code)  |expect(foo).toThrowError(T)|
*/
describe('app-promise', () => {
  // common arrange
  beforeEach(() => { console.log('ここに書いた内容は各itで毎回実行されます。') });

  it('1. delay', async function () {
    const prev = Date.now();
    await AppPromise.delay(500);
    const next = Date.now();
    expect(next - prev >= 500).toBeTrue();
  });
});
