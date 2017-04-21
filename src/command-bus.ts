import {Message} from './message';
import {MessageBus} from './message-bus';
import {MessageHandler} from './message-handler';

export class CommandBus extends MessageBus {
    registerHandler(type: string, handler: MessageHandler): void {
        if (this.handlers[type] && this.handlers[type].length) {
            throw new Error('Handler for type ' + type + ' is already registered.');
        }

        super.registerHandler(type, handler);
    }

    handle(message: Message, next: Function, error?: Function): void {
        this.verifyMessage(message);

        if ('undefined' === typeof this.handlers[message.type] || 0 === this.handlers[message.type].length) {
            throw new Error('No handler is registered for message of type ' + message.type);
        }

        this.processMessage(message, next, error);
    }
}
