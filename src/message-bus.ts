import {isMessageHandler, MessageHandler, NOT_PROPER_HANDLER} from './message-handler';
import {isMessage, Message, NOT_PROPER_MESSAGE} from './message';
import {isMiddleware, Middleware, NOT_PROPER_MIDDLEWARE} from './middleware';
import {isPromise, oneOfOneTime} from './utils';

export abstract class MessageBus {
    protected handlers = {}; // TODO typings for that
    protected middlewares: Middleware[] = [];
    protected defaultErrorHandler: Function;

    registerHandler(type: string, handler: MessageHandler): void {
        if (false === isMessageHandler(handler)) {
            throw new Error(NOT_PROPER_HANDLER);
        }

        this.handlers[type] = this.handlers[type] || [];
        this.handlers[type].push(handler);
    }

    registerMiddleware(middleware: Middleware): void {
        if (false === isMiddleware(middleware)) {
            throw new Error(NOT_PROPER_MIDDLEWARE);
        }

        this.middlewares.push(middleware);
    }

    handle(message: Message, next: Function, error?: Function): void {
        this.verifyMessage(message);
        this.processMessage(message, next, error);
    }

    registerDefaultErrorHandler(handler: Function): void {
        this.defaultErrorHandler = handler;
    }

    protected verifyMessage(message) {
        if (false === isMessage(message)) {
            throw new Error(NOT_PROPER_MESSAGE);
        }
    }

    protected processMessage(message: Message, next: Function, error?: Function) {
        const handlers = this.handlers[message.type] ? this.handlers[message.type].slice() : [];
        const errorCallback = error || this.defaultErrorHandler || (() => {});

        processMiddlewares(this.middlewares, message, () => {
            const nextHandler = (() => {
                const handler = handlers.shift();
                if (handler) {

                    const callbacks = oneOfOneTime({errorCallback, nextHandler});
                    const result = handler.call(undefined, message, callbacks.nextHandler, callbacks.errorCallback);

                    if (isPromise(result)) {
                        result.then(callbacks.nextHandler, callbacks.errorCallback);
                    }
                } else {
                    next();
                }
            });

            nextHandler();
        }, errorCallback);
    }
}

const processMiddlewares = (middlewares: Middleware[], message: Message, callback: Function, error: Function) => {
    const middlewaresCopy = middlewares.slice();
    const next = () => {
        const callbacks = oneOfOneTime({callback, next, error});
        const middleware = middlewaresCopy.shift();
        if (middleware) {
            middleware.call(undefined, message, callbacks.next, callbacks.error);
        } else {
            callbacks.callback();
        }
    };

    next();
};