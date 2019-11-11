import {assert, expect} from 'chai';
import {configureBusForTesting} from '../utils/configureBusForTesting';
import {getErrorMessageForCrashedWithError} from '../utils/getErrorMessageForCrashedWithError';
import {getErrorMessageForCrashedWithRejection} from '../utils/getErrorMessageForCrashedWithRejection';

describe('BaseMessageBus#handle', () => {
    it('should stop processing if a middleware crashes with synchronous error', done => {
        const {bus, logger, middlewareA, messageFoo} = configureBusForTesting();
        middlewareA.mode = 'crashing-with-error';
        bus.handle(messageFoo)
            .then(() => assert.fail())
            .catch(e => {
                expect(e).to.be.instanceOf(Error);
                expect(e.message).to.equal(
                    getErrorMessageForCrashedWithError(middlewareA),
                );

                expect(logger.list).to.have.lengthOf(0);

                done();
            });

    });

    it('should stop processing if a middleware crashes with synchronous error', done => {
        const {bus, logger, middlewareA, messageFoo} = configureBusForTesting();
        middlewareA.mode = 'crashing-with-rejection';
        bus.handle(messageFoo)
            .then(() => assert.fail())
            .catch(reason => {
                expect(reason).to.equal(getErrorMessageForCrashedWithRejection(middlewareA));
                expect(logger.list).to.have.lengthOf(0);

                done();
            });

    });
});
