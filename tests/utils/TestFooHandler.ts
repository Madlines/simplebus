import {Message, MessageHandlerObject} from '../../src';
import {handleMessage} from './handleMessage';
import {TestHandlerMode} from './TestHandlerMode';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';

export class TestFooHandler implements MessageHandlerObject<{foo: string}> {
    mode: TestHandlerMode = 'working';

    constructor(
        private logger?: TestMessageHandlerLogger,
    ) {}

    handle(message: Message<{foo: string}>): Promise<void> {
        return handleMessage(
            message,
            this.mode,
            this,
            this.logger,
        );
    }

    getSupportedType(): string {
        return 'foo';
    }
}
