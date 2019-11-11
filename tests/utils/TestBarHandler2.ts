import {TestBarHandler} from './TestBarHandler';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';

export class TestBarHandler2 extends TestBarHandler {
    constructor(
        logger?: TestMessageHandlerLogger,
    ) {
        super(logger);
    }
}
