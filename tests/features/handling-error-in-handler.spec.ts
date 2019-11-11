import {assert, expect} from 'chai';
import {configureBusForTesting} from '../utils/configureBusForTesting';
import {getErrorMessageForCrashedWithError} from '../utils/getErrorMessageForCrashedWithError';
import {getErrorMessageForCrashedWithRejection} from '../utils/getErrorMessageForCrashedWithRejection';
import {TestBarHandler} from '../utils/TestBarHandler';
import {TestMiddlewareA} from '../utils/TestMiddlewareA';
import {TestMiddlewareB} from '../utils/TestMiddlewareB';

describe('BaseMessageBus#handle', () => {
    it('should stop processing if a handler crashes with synchronous error', done => {
        const {bus, logger, handlerFoo, messageFoo} = configureBusForTesting();
        handlerFoo.mode = 'crashing-with-error';
        bus.handle(messageFoo)
            .then(() => assert.fail())
            .catch(e => {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.equal(
                    getErrorMessageForCrashedWithError(handlerFoo),
                );

                expect(logger.list).to.deep.equal([
                    [TestMiddlewareA.name, messageFoo],
                    [TestMiddlewareB.name, messageFoo],
                ]);

                done();
            });
    });

    it('should stop processing if a handler crashes with promise rejection', done => {
        const {bus, logger, handlerBar2, messageBar} = configureBusForTesting();
        handlerBar2.mode = 'crashing-with-rejection';
        bus.handle(messageBar)
            .then(() => {
                assert.fail();
            })
            .catch(reason => {
                expect(reason).to.equal(
                    getErrorMessageForCrashedWithRejection(handlerBar2),
                );

                expect(logger.list).to.deep.equal([
                    [TestMiddlewareA.name, messageBar],
                    [TestMiddlewareB.name, messageBar],
                    [TestBarHandler.name, messageBar],
                ]);

                done();
            });
    });
});
