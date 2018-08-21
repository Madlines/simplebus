import {MessageHandler} from './MessageHandler';
import {Message} from './Message';
import {Middleware} from './Middleware';
import {Util} from './Util';

export abstract class MessageBus {
    protected handlers: { [k: string]: MessageHandler<Message>[] } = {};
    protected middleware: Middleware[] = [];
    protected defaultErrorHandler: Function;

    registerHandler<T extends Message>(type: string, handler: MessageHandler<T>): void {
        if (false === MessageHandler.isMessageHandler(handler)) {
            throw new Error(MessageHandler.NOT_PROPER_HANDLER);
        }

        this.handlers[type] = this.handlers[type] || [];
        this.handlers[type].push(handler);
    }

    unregisterHandler<T extends Message>(type: string, handler: MessageHandler<T>): void {
        if (!this.handlers[type]) {
            return;
        }

        this.handlers[type] = this.handlers[type].filter(registeredHandler => registeredHandler !== handler);
    }

    registerMiddleware(middleware: Middleware): void {
        if (false === Middleware.isMiddleware(middleware)) {
            throw new Error(Middleware.NOT_PROPER_MIDDLEWARE);
        }

        this.middleware.push(middleware);
    }

    handle(message: Message, next: Function, error?: Function): void {
        this.verifyMessage(message);
        this.processMessage(message, next, error);
    }

    registerDefaultErrorHandler(handler: Function): void {
        this.defaultErrorHandler = handler;
    }

    protected verifyMessage(message) {
        if (false === Message.isMessage(message)) {
            throw new Error(Message.NOT_PROPER_MESSAGE);
        }
    }

    protected processMessage(message: Message, next: Function, error?: Function) {
        const handlers = this.handlers[message.type] ? this.handlers[message.type].slice() : [];
        const errorCallback = error || this.defaultErrorHandler || (() => {});

        processMiddlewares(this.middleware, message, () => {
            const nextHandler = (() => {
                const handler = handlers.shift();
                if (handler) {
                    const callbacks = Util.oneOfOneTime({errorCallback, nextHandler});
                    const result = handler.call(undefined, message, callbacks.nextHandler, callbacks.errorCallback);

                    if (Util.isPromise(result)) {
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
        const callbacks = Util.oneOfOneTime({callback, next, error});
        const middleware = middlewaresCopy.shift();
        if (middleware) {
            middleware.call(undefined, message, callbacks.next, callbacks.error);
        } else {
            callbacks.callback();
        }
    };

    next();
};