import {Message, MessageBusMiddleware} from '../../src';
import {handleMessage} from './handleMessage';
import {TestHandlerMode} from './TestHandlerMode';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';

export class TestMiddlewareA implements MessageBusMiddleware<any> {
    mode: TestHandlerMode = 'working';

    constructor(
        private logger?: TestMessageHandlerLogger,
    ) {}

    handle(message: Message<any>): Promise<void> {
        return handleMessage(
            message,
            this.mode,
            this,
            this.logger,
        );
    }
}
