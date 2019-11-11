import {HandlersMap} from '../Lib/HandlersMap';
import {Message} from '../Lib/Message';
import {MessageBus} from '../Lib/MessageBus';
import {MessageHandler} from '../Lib/MessageHandler';
import {MessageHandlerObject} from '../Lib/MessageHandlerObject';
import {MessageSubscriber} from '../Lib/MessageSubscriber';

export class MessageSubscriberImplementation implements MessageSubscriber {
    private handlersMap: HandlersMap = {};

    constructor(private messageBus: MessageBus) {
    }

    on<P>(_: string | Message<P> | MessageHandlerObject<P>, __?: MessageHandler<P>): [string, MessageHandler<P>] {
        const [type, handler] = this.messageBus.registerHandler(arguments[0], arguments[1]);
        this.handlersMap[type] = this.handlersMap[type] || [];
        this.handlersMap[type].push(handler);

        return [type, handler];
    }

    destroy(): void {
        Object.keys(this.handlersMap).forEach(type => {
            this.handlersMap[type].forEach(entry => {
                this.messageBus.unregisterHandler(type, entry);
            });
        });

        this.handlersMap = {};
    }
}
