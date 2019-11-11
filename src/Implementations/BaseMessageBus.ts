import {HandlersMap} from '../Lib/HandlersMap';
import {Message} from '../Lib/Message';
import {MessageBus} from '../Lib/MessageBus';
import {MessageBusMiddleware} from '../Lib/MessageBusMiddleware';
import {MessageHandler} from '../Lib/MessageHandler';
import {MessageHandlerObject} from '../Lib/MessageHandlerObject';
import {isMessage} from './TypeCheckers/isMessage';
import {isMessageHandler} from './TypeCheckers/isMessageHandler';
import {isMessageHandlerFunction} from './TypeCheckers/isMessageHandlerFunction';
import {isMessageHandlerObject} from './TypeCheckers/isMessageHandlerObject';

export abstract class BaseMessageBus implements MessageBus {
    protected handlersMap: HandlersMap = {};
    protected middlewareList: MessageBusMiddleware<any>[] = [];

    async handle<P>(message: Message<P>): Promise<void> {
        const type = message.type;

        for (const middleware of this.middlewareList) {
            // We're not catching potential exceptions.
            // One middleware crashes, the message won't even reach the handlers.
            await middleware.handle(message);
        }

        if (!this.handlersMap[type]) {
            return;
        }

        for (const handler of this.handlersMap[type]) {
            // We're not catching potential exceptions.
            // One handler crashes, we skip the rest of them.
            if (isMessageHandlerFunction(handler)) {
                await handler(message);
            } else {
                await handler.handle(message);
            }
        }
    }

    registerHandler<P>(
        arg1: string | Message<P> | MessageHandlerObject<P>,
        arg2?: MessageHandler<P>,
    ): [string, MessageHandler<P>] {
        const [type, handler] = this.getTypeAndHandlerFromArgs([arg1, arg2]);
        this.addHandlerToMap(type, handler);
        return [type, handler];
    }

    unregisterHandler<P>(
        arg1: string | Message<P> | MessageHandlerObject<P>,
        arg2?: MessageHandler<P>,
    ): [string, MessageHandler<P>] | void {
        const [type, handler] = this.getTypeAndHandlerFromArgs([arg1, arg2]);
        if (!this.handlersMap[type]) {
            return;
        }

        this.handlersMap[type] = this.handlersMap[type].filter(v => v !== handler);
        if (this.handlersMap[type].length === 0) {
            delete this.handlersMap[type];
        }

        return [type, handler];
    }

    registerMiddleware<P>(middleware: MessageBusMiddleware<P>): void {
        this.middlewareList.push(middleware);
    }

    protected addHandlerToMap<P>(type: string, handler: MessageHandler<P>) {
        this.handlersMap[type] = this.handlersMap[type] || [];
        this.handlersMap[type].push(handler);
    }

    protected getTypeAndHandlerFromArgs(args: any[]): [string, MessageHandler<any>] {
        let type: string | null = null;
        let handler: MessageHandler<any> | null = null;

        if (isMessageHandlerObject(args[0])) {
            handler = args[0];
            type = handler.getSupportedType();
        } else {
            type = isMessage(args[0])
                ? args[0].type
                : args[0];
            handler = args[1];
        }

        if ('string' !== typeof type) {
            throw new Error('type needs to be a string');
        }

        if ('' === type) {
            throw new Error('Cannot use an empty string as a type');
        }

        if (!isMessageHandler(handler)) {
            throw new Error('handler must be a function or an object of type MessageHandlerObject');
        }

        if (!type || !handler) {
            throw new Error('Cannot move forward without a type and a handler');
        }

        return [type, handler];
    }
}
