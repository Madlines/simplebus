import {Message, MessageBusMiddleware, MessageHandlerObject} from '../../src';
import {getErrorMessageForCrashedWithError} from './getErrorMessageForCrashedWithError';
import {getErrorMessageForCrashedWithRejection} from './getErrorMessageForCrashedWithRejection';
import {TestHandlerMode} from './TestHandlerMode';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';

export function handleMessage<P>(
    message: Message<P>,
    mode: TestHandlerMode,
    handlerClassInstance: MessageHandlerObject<P> | MessageBusMiddleware<any>,
    logger?: TestMessageHandlerLogger,
): Promise<void> {
    if (mode === 'crashing-with-error') {
        throw new Error(
            getErrorMessageForCrashedWithError(handlerClassInstance),
        );
    }

    /**
     * Promise notation is deliberately used here instead of async/await
     * so we can test against both promise rejection and exception being thrown
     */
    return new Promise((resolve, reject) => {
        if (mode === 'working') {
            if (logger) {
                logger.log(
                    Reflect.getPrototypeOf(handlerClassInstance).constructor.name,
                    message,
                );
            }

            resolve();
        }

        if (mode === 'crashing-with-rejection') {
            reject(
                getErrorMessageForCrashedWithRejection(handlerClassInstance),
            );
        }
    });
}
