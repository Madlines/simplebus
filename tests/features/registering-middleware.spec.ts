import {expect} from 'chai';
import {TestMessageBusImplementation} from '../utils/TestMessageBusImplementation';
import {TestMiddlewareA} from '../utils/TestMiddlewareA';

describe('BaseMessageBus#registerMiddleware', () => {
    it('should allow to register middleware instances', () => {
        const bus = new TestMessageBusImplementation();
        const middleware1 = new TestMiddlewareA();
        const middleware2 = new TestMiddlewareA();

        bus.registerMiddleware(middleware1);
        bus.registerMiddleware(middleware2);

        expect(bus.getMiddlewareList()).to.contain(middleware1);
        expect(bus.getMiddlewareList()).to.contain(middleware2);
    });
});
