import {FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED, isFunction, isPromise, oneOfOneTime,} from '../src/utils';
import createSpy = jasmine.createSpy;
test('isFunction() should properly detect functions', () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction(setTimeout)).toBe(true);
});

test('isPromise() should properly detect promises using duck typing', () => {
    expect(isPromise({'then': () => {}, 'catch': () => {}})).toBe(true);
    expect(isPromise({'catch': () => {}})).toBe(false);
    expect(isPromise({'then': () => {}})).toBe(false);
});

test('oneOfOneTime should only allow to call one of prepared function and one time only', () => {
    const foo = (x) => {};
    const bar = (x) => {};

    const spyFoo = createSpy('foo', foo);
    const oneTimers = oneOfOneTime({foo: spyFoo, bar});

    oneTimers.foo('qwe');

    expect(() => oneTimers.foo('lorem')).toThrow(FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED);
    expect(() => oneTimers.bar('ipsum')).toThrow(FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED);

    expect(spyFoo).toBeCalledWith('qwe');
    expect(spyFoo).toHaveBeenCalledTimes(1);
});
