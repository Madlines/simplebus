import {expect} from 'chai';
import {EventBus, Message} from '../../src';
import {TestBarHandler} from '../utils/TestBarHandler';
import {TestBarHandler2} from '../utils/TestBarHandler2';
import {TestFooHandler} from '../utils/TestFooHandler';
import {TestMessageHandlerLogger} from '../utils/TestMessageHandlerLogger';

describe('EventBus#handle', () => {
    it('should properly call handlers registered with MessageSubscriber', async () => {
        const bus = new EventBus();
        const subscriber = bus.createSubscriber();
        const logger = new TestMessageHandlerLogger();
        const message: Message<{bar: string}> = {
            payload: {bar: 'ipsum'},
            type: 'bar',
        };

        subscriber.on(new TestFooHandler(logger));
        subscriber.on(new TestBarHandler(logger));
        subscriber.on(new TestBarHandler2(logger));

        await bus.handle(message);

        expect(logger.list).to.deep.equal([
            [TestBarHandler.name, message],
            [TestBarHandler2.name, message],
        ]);
    });
});
