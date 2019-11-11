import {MessageBusMiddleware, MessageHandlerObject} from '../../src';

const CRASHED_WITH_PROMISE_REJECTION = '{name} crashed with a promise rejection';

export function getErrorMessageForCrashedWithRejection<P>(
    handlerClassInstance: MessageHandlerObject<P> | MessageBusMiddleware<any>,
): string {
    return CRASHED_WITH_PROMISE_REJECTION.replace(
        '{name}',
        Reflect.getPrototypeOf(handlerClassInstance).constructor.name,
    );
}
