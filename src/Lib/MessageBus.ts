import {Message} from './Message';
import {MessageBusMiddleware} from './MessageBusMiddleware';
import {MessageHandler} from './MessageHandler';
import {MessageHandlerObject} from './MessageHandlerObject';

export interface  MessageBus {
    handle<P>(message: Message<P>): Promise<void>;

    // TODO how about having a separate interface for ConfigurableMessageBus?
    registerHandler<P>(handler: MessageHandlerObject<P>): [string, MessageHandler<P>];
    registerHandler<P>(type: string, handler: MessageHandler<P>): [string, MessageHandler<P>];
    registerHandler<P>(message: Message<P>, handler: MessageHandler<P>): [string, MessageHandler<P>];

    unregisterHandler<P>(handler: MessageHandlerObject<P>): [string, MessageHandler<P>] | void;
    unregisterHandler<P>(type: string, handler: MessageHandler<P>): [string, MessageHandler<P>] | void;
    unregisterHandler<P>(message: Message<P>, handler: MessageHandler<P>): [string, MessageHandler<P>] | void;

    registerMiddleware<P>(middleware: MessageBusMiddleware<P>): void;
}
