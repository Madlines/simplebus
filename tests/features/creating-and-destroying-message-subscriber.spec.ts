import {expect} from 'chai';
import {TestBarHandler} from '../utils/TestBarHandler';
import {TestBarHandler2} from '../utils/TestBarHandler2';
import {TestEventBusImplementation} from '../utils/TestEventBusImplementation';
import {TestFooHandler} from '../utils/TestFooHandler';

describe('MessageSubscriber#on and MessageSubscriber#destroy', () => {
    it('should allow for registering additional handlers and then unregistering them in one call', () => {
        const bus = new TestEventBusImplementation();
        const subscriber = bus.createSubscriber();

        const handler1 = new TestBarHandler();
        const handler2 = new TestFooHandler();
        const handler3 = new TestBarHandler2();
        const handler4 = () => void 0;

        bus.registerHandler(handler1);

        subscriber.on(handler2);
        subscriber.on(handler3);
        subscriber.on('lorem', handler4);

        expect(
            bus.getHandlersMap(),
        ).to.deep.equal({
            bar: [handler1, handler3],
            foo: [handler2],
            lorem: [handler4],
        });

        subscriber.destroy();

        expect(
            bus.getHandlersMap(),
        ).to.deep.equal({
            bar: [handler1],
        });
    });
});
