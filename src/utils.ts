export const FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED = 'A function from this set has been already called';

export const isFunction = (object): boolean => 'function' === typeof object;
export const isPromise = (object): boolean => object && isFunction(object.then) && isFunction(object.catch);

export const oneOfOneTime = (object: {[key: string]: Function}): WrapperOneTimeFunctions => {
    const wrappedFunctions = {
        alreadyCalled: false
    };

    for (let i in object) {
        const func = object[i];
        wrappedFunctions[i] = function () {
            if (!wrappedFunctions.alreadyCalled) {
                wrappedFunctions.alreadyCalled = true;
                func.apply(undefined, arguments);
            } else {
                throw new Error(FUNCTION_FROM_THIS_SET_HAS_BEEN_ALREADY_CALLED);
            }
        };

        // TODO remove?
        wrappedFunctions[i]['wrapper'] = wrappedFunctions;
    }

    return wrappedFunctions;
};

interface WrapperOneTimeFunctions {
    alreadyCalled: boolean;
    [key: string]: Function | any;
}