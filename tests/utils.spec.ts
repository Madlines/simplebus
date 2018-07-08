import createSpy = jasmine.createSpy;
import {Util} from '../src/Util';

test('isFunction() should properly detect functions', () => {
    expect(Util.isFunction({})).toBe(false);
    expect(Util.isFunction(setTimeout)).toBe(true);
});

test('isPromise() should properly detect promises using duck typing', () => {
    expect(Util.isPromise({'then': () => {}, 'catch': () => {}})).toBe(true);
    expect(Util.isPromise({'catch': () => {}})).toBe(false);
    expect(Util.isPromise({'then': () => {}})).toBe(false);
});

test('oneOfOneTime() should only allow to call one of prepared function and one time only', () => {
    const foo = () => {};
    const bar = () => {};

    const spyFoo = createSpy('foo', foo);
    const oneTimers = Util.oneOfOneTime({foo: spyFoo, bar});

    oneTimers.foo('qwe');

    expect(() => oneTimers.foo('lorem')).toThrow(Util.FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED);
    expect(() => oneTimers.bar('ipsum')).toThrow(Util.FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED);

    expect(spyFoo).toBeCalledWith('qwe');
    expect(spyFoo).toHaveBeenCalledTimes(1);
});
