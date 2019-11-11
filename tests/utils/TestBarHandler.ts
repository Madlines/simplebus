import {Message, MessageHandlerObject} from '../../src';
import {handleMessage} from './handleMessage';
import {TestHandlerMode} from './TestHandlerMode';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';

export class TestBarHandler implements MessageHandlerObject<{bar: string}> {
    mode: TestHandlerMode = 'working';

    constructor(
        private logger?: TestMessageHandlerLogger,
    ) {}

    handle(message: Message<{bar: string}>): Promise<void> {
        return handleMessage(
            message,
            this.mode,
            this,
            this.logger,
        );
    }

    getSupportedType(): string {
        return 'bar';
    }
}
