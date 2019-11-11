import {Message} from '../Lib/Message';
import {MessageHandler} from '../Lib/MessageHandler';
import {BaseMessageBus} from './BaseMessageBus';

export class CommandBus extends BaseMessageBus {
    registerHandler<P>(
        arg1: string | Message<P> | MessageHandler<P>,
        arg2?: MessageHandler<P>,
    ): [string, MessageHandler<P>] {
        const [type, handler] = this.getTypeAndHandlerFromArgs([arg1, arg2]);
        if (this.handlersMap[type]) {
            throw new Error('There can be only one handler per type in CommandBus');
        }

        super.addHandlerToMap(type, handler);
        return [type, handler];
    }

    async handle<P>(message: Message<P>): Promise<void> {
        const type = message.type;
        if (!this.handlersMap[type]) {
            throw new Error(`There is no single handler for type: ${type} registered in CommandBus`);
        }

        return super.handle(message);
    }
}
