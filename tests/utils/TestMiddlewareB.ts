import {Message, MessageBusMiddleware} from '../../src';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';

export class TestMiddlewareB implements MessageBusMiddleware<any> {
    constructor(
        private logger?: TestMessageHandlerLogger,
    ) {}

    async handle(message: Message<any>) {
        if (this.logger) {
            this.logger.log(Reflect.getPrototypeOf(this).constructor.name, message);
        }
    }
}
