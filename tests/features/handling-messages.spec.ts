import {expect} from 'chai';
import {configureBusForTesting} from '../utils/configureBusForTesting';
import {TestFooHandler} from '../utils/TestFooHandler';
import {TestMiddlewareA} from '../utils/TestMiddlewareA';
import {TestMiddlewareB} from '../utils/TestMiddlewareB';

describe('BaseMessageBus#handle', () => {
    it('should run each middleware running handler(s)', async () => {
        const {bus, logger, messageFoo} = configureBusForTesting();

        await bus.handle(messageFoo);
        expect(logger.list).to.deep.equal([
            [TestMiddlewareA.name, messageFoo],
            [TestMiddlewareB.name, messageFoo],
            [TestFooHandler.name, messageFoo],
        ]);
    });
});
