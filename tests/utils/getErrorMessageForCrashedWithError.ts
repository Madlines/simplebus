import {MessageBusMiddleware, MessageHandlerObject} from '../../src';

const CRASHED_WITH_AN_ERROR = '{name} crashed with an error';

export function getErrorMessageForCrashedWithError<P>(
    handlerClassInstance: MessageHandlerObject<P> | MessageBusMiddleware<any>,
): string {
    return CRASHED_WITH_AN_ERROR.replace(
        '{name}',
        Reflect.getPrototypeOf(handlerClassInstance).constructor.name,
    );
}
