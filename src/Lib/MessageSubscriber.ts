import {Message} from './Message';
import {MessageHandler} from './MessageHandler';
import {MessageHandlerObject} from './MessageHandlerObject';

export interface MessageSubscriber {
    on<P>(handler: MessageHandlerObject<P>): [string, MessageHandler<P>];
    on<P>(type: string, handler: MessageHandler<P>): [string, MessageHandler<P>];
    on<P>(message: Message<P>, handler: MessageHandler<P>): [string, MessageHandler<P>];

    destroy(): void;
}
