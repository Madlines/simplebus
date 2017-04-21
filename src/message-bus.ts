import { MessageHandler, isMessageHandler, NO_PROPER_HANDLER } from './message-handler';
import { Message, isMessage, NO_PROPER_MESSAGE } from './message';
import { Middleware, isMiddlware, NO_PROPER_MIDDLEWARE } from './middleware';

export abstract class MessageBus {
    protected handlers = {}; // TODO typings for that
    protected middlewares: Middleware[] = [];
    protected defaultErrorHandler: Function;

    registerHandler(type: string, handler: MessageHandler): void {
        if (false === isMessageHandler(handler)) {
            throw new Error(NO_PROPER_HANDLER);
        }

        this.handlers[type] = this.handlers[type] || [];
        this.handlers[type].push(handler);
    }

    registerMiddleware(middleware: Middleware): void {
        if (false === isMiddlware(middleware)) {
            throw new Error(NO_PROPER_MIDDLEWARE);
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
            throw new Error(NO_PROPER_MESSAGE);
        }
    }

    protected processMessage(message: Message, next: Function, error?: Function) {
        const handlers = this.handlers[message.type] ? this.handlers[message.type].slice() : [];
        const errorCallback = error || this.defaultErrorHandler || (() => {});

        processMiddlewares(this.middlewares, message, () => {
            const nextHandler = () => {
                const handler = handlers.shift();
                if (handler) {
                    handler.call(undefined, message, nextHandler, errorCallback);
                } else {
                    next();
                }
            };

            nextHandler();
        }, errorCallback);
    }
}

const processMiddlewares = (middlewares: Middleware[], message: Message, callback: Function, error: Function) => {
    const middlewaresCopy = middlewares.slice();
    const next = () => {
        const middleware = middlewaresCopy.shift();
        if (middleware) {
            middleware.call(undefined, message, next, error);
        } else {
            callback();
        }
    };

    next();
};