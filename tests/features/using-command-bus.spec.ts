import {assert, expect} from 'chai';
import {CommandBus, Message} from '../../src';
import {TestBarHandler} from '../utils/TestBarHandler';
import {TestBarHandler2} from '../utils/TestBarHandler2';
import {TestFooHandler} from '../utils/TestFooHandler';
import {TestMessageHandlerLogger} from '../utils/TestMessageHandlerLogger';

describe('CommandBus', () => {
    it('should not allow to register more that one handler per type', () => {
        const bus = new CommandBus();
        bus.registerHandler('bar', new TestBarHandler());

        expect(() => bus.registerHandler('bar', new TestBarHandler2())).to.throw();
    });

    it('should crash with promise rejection if there is no handler registered for a type', done => {
        const bus = new CommandBus();
        bus.registerHandler(new TestBarHandler());
        const message: Message<{foo: string}> = {
            payload: {foo: 'lorem'},
            type: 'foo',
        };

        bus.handle(message)
            .then(() => assert.fail())
            .catch(() => done());
    });

    it('should properly handle a message if there is a matching handler', async () => {
        const bus = new CommandBus();
        const logger = new TestMessageHandlerLogger();

        const message: Message<{foo: string}> = {
            payload: {foo: 'lorem'},
            type: 'foo',
        };

        bus.registerHandler(new TestFooHandler(logger));
        bus.registerHandler(new TestBarHandler(logger));

        await bus.handle(message);

        expect(logger.list).to.deep.equal([
            [TestFooHandler.name, message],
        ]);
    });
});
