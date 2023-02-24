
/* eslint-disable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-this-alias,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-call */
/**
 * Debounce（呼び出しがdelayされる。delay中に再度呼び出されるかぎり手前の呼び出しはなかったことになる）
 * @param delay ms
 * @returns 
 */
export function Debounce(delay = 300): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const sym = Symbol();
    const originalFunc = descriptor.value;
    descriptor.value = function (...args: any) {
      const that: any = this;
      clearTimeout(that[sym]);
      that[sym] = setTimeout(() => originalFunc.apply(this, args), delay);
    };
    return descriptor;
  };
}