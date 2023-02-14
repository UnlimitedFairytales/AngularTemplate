import { AbstractControl, ValidatorFn } from '@angular/forms';
import { AppValidators } from './app-validators';

/*
|Assert          |xUnit.net               |Jasmine                    |
|----------------|------------------------|---------------------------|
|ルーズな比較    |Assert.Equal(exp, act)  |expect(act).toEqual(exp)   |
|参照の比較      |Assert.Same(exp, act)   |expect(act).toBe(exp)      |
|参照の比較(否定)|Assert.NotSame(exp, act)|expect(act).not.toBe(exp)  |
|例外発生        |Assert.Throws<T>(code)  |expect(foo).toThrowError(T)|
*/
describe('app-validators', () => {
  // common arrange
  beforeEach(() => { console.log('ここに書いた内容は各itで毎回実行されます。') });

  it('1. AppValidators.number', () => {
    expect(testFn(AppValidators.number('dummy'), undefined)).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), null)).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), 'Infinity')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '-Infinity')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), 'true')).toBeFalse();
    expect(testFn(AppValidators.number('dummy'), true)).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), 'false')).toBeFalse();
    expect(testFn(AppValidators.number('dummy'), ' \t\r\n　')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '1.23456789123456789123456789')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), 'abcdefgh')).toBeFalse();
    expect(testFn(AppValidators.number('dummy'), '0b1010')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '0xFFFF')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '0o12')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '1.52e10')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '-1')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '0')).toBeTrue();
    expect(testFn(AppValidators.number('dummy'), '1')).toBeTrue();
  });

  it('2. AppValidators.integer', () => {
    expect(testFn(AppValidators.integer('dummy'), undefined)).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), null)).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), 'Infinity')).toBeFalse();
    expect(testFn(AppValidators.integer('dummy'), '-Infinity')).toBeFalse();
    expect(testFn(AppValidators.integer('dummy'), 'true')).toBeFalse();
    expect(testFn(AppValidators.integer('dummy'), true)).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), 'false')).toBeFalse();
    expect(testFn(AppValidators.integer('dummy'), ' \t\r\n　')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '1.23456789123456789123456789')).toBeFalse();
    expect(testFn(AppValidators.integer('dummy'), 'abcdefgh')).toBeFalse();
    expect(testFn(AppValidators.integer('dummy'), '0b1010')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '0xFFFF')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '0o12')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '1.52e10')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '-1')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '0')).toBeTrue();
    expect(testFn(AppValidators.integer('dummy'), '1')).toBeTrue();
  });

  it('3. AppValidators.nonNegativeInteger', () => {
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), undefined)).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), null)).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), 'Infinity')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '-Infinity')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), 'true')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), true)).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), 'false')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), ' \t\r\n　')).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '1.23456789123456789123456789')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), 'abcdefgh')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '0b1010')).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '0xFFFF')).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '0o12')).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '1.52e10')).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '-1')).toBeFalse();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '0')).toBeTrue();
    expect(testFn(AppValidators.nonNegativeInteger('dummy'), '1')).toBeTrue();
  });

  it('4. AppValidators.telephone', () => {
    expect(testFn(AppValidators.telephone('dummy'), undefined)).toBeTrue();
    expect(testFn(AppValidators.telephone('dummy'), null)).toBeTrue();
    expect(testFn(AppValidators.telephone('dummy'), 'Infinity')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '-Infinity')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), 'true')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), true)).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), 'false')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), ' \t\r\n　')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '1.23456789123456789123456789')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), 'abcdefgh')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '0b1010')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '0xFFFF')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '0o12')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '1.52e10')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '-1')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '0')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '1')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '081-090-9151-0000')).toBeTrue();
    expect(testFn(AppValidators.telephone('dummy'), '090-9151-0000')).toBeTrue();
    expect(testFn(AppValidators.telephone('dummy'), '0-90915-10000')).toBeTrue();
    expect(testFn(AppValidators.telephone('dummy'), '0909151-0000')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '090-91510000')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '09091510000')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), ' 090-9151-0000 ')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '123-45-12345-12345')).toBeTrue();
    expect(testFn(AppValidators.telephone('dummy'), '1234-5-12345-12345')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '123-456-12345-12345')).toBeFalse();
    expect(testFn(AppValidators.telephone('dummy'), '090-91-51-00000-00')).toBeFalse();
  });
});

type Writable<T> = { -readonly [P in keyof T]: T[P] };
class DummyControl extends AbstractControl {
  constructor() { super(null, null); }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  setValue(value: any, options?: Object | undefined): void { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  patchValue(value: any, options?: Object | undefined): void { }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  reset(value?: any, options?: Object | undefined): void { }
}
function testFn(validatorFn: ValidatorFn, input: unknown): boolean {
  const a = new DummyControl();
  (a as Writable<DummyControl>).value = input;
  console.log(a.value);
  return validatorFn(a) === null;
}