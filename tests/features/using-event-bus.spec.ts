import {expect} from 'chai';
import {EventBus, Message} from '../../src';
import {TestBarHandler} from '../utils/TestBarHandler';
import {TestBarHandler2} from '../utils/TestBarHandler2';
import {TestFooHandler} from '../utils/TestFooHandler';
import {TestMessageHandlerLogger} from '../utils/TestMessageHandlerLogger';

describe('EventBus', () => {
    it('should properly handle message when there are no matching handlers', async () => {
        const bus = new EventBus();
        bus.registerHandler(new TestFooHandler());
        bus.registerHandler(new TestBarHandler());

        await bus.handle({type: 'anything', payload: {}});
    });
    it('should properly handle message multiple times when there are multiple matching handlers', async () => {
        const bus = new EventBus();
        const logger = new TestMessageHandlerLogger();
        const message: Message<{bar: string}> = {
            payload: {bar: 'ipsum'},
            type: 'bar',
        };

        bus.registerHandler(new TestFooHandler(logger));
        bus.registerHandler(new TestBarHandler(logger));
        bus.registerHandler(new TestBarHandler2(logger));

        await bus.handle(message);

        expect(logger.list).to.deep.equal([
            [TestBarHandler.name, message],
            [TestBarHandler2.name, message],
        ]);
    });
});
