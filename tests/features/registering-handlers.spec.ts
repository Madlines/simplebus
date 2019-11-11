import {expect} from 'chai';
import {Message, MessageHandlerFunction} from '../../src';
import {TestFooHandler} from '../utils/TestFooHandler';
import {TestMessageBusImplementation} from '../utils/TestMessageBusImplementation';

describe('BaseMessageBus#registerHandler', () => {
    it('should allow to register handlers as class instances', () => {
        const handler = new TestFooHandler();
        const bus = new TestMessageBusImplementation();
        bus.registerHandler(handler);

        expect(bus.getHandlersMap().foo).to.contain(handler);
    });

    it('should allow to register handlers as types and class instances', () => {
        const handler = new TestFooHandler();
        const bus = new TestMessageBusImplementation();
        bus.registerHandler('foo', handler);

        expect(bus.getHandlersMap().foo).to.contain(handler);
    });

    it('should allow to register handlers as messages and class instances', () => {
        const handler = new TestFooHandler();
        const message: Message<{foo: string}> = {type: 'foo', payload: {foo: 'bar'}};
        const bus = new TestMessageBusImplementation();
        bus.registerHandler(message, handler);

        expect(bus.getHandlersMap().foo).to.contain(handler);
    });

    it('should allow to register handlers as types and functions', () => {
        const handler: MessageHandlerFunction<any> = async () => void 0;
        const bus = new TestMessageBusImplementation();
        bus.registerHandler('foo', handler);

        expect(bus.getHandlersMap().foo).to.contain(handler);
    });

    it('should allow to register handlers as messages and functions', () => {
        const handler: MessageHandlerFunction<any> = async () => void 0;
        const message: Message = {type: 'foo'};
        const bus = new TestMessageBusImplementation();
        bus.registerHandler(message, handler);

        expect(bus.getHandlersMap().foo).to.contain(handler);
    });
});
