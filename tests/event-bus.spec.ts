import { MessageBus } from '../src/message-bus';
import { EventBus } from '../src/event-bus';
import { NOT_PROPER_MESSAGE } from '../src/message';
import { registerAbstractTests } from './message-bus.abstract-spec';

describe('EventBus', () => {
    const shared: {
        busFactory?(): MessageBus;
    } = {};

    beforeEach(() => {
        shared.busFactory = () => new EventBus();
    });

    registerAbstractTests(shared);

    it('should just trigger success callback no handler is registered for command being handled', (done) => {
        const bus = shared.busFactory();
        bus.registerHandler('bar', () => { });
        bus.handle({ type: 'foo' }, () => {
            done();
        });
    });

    it('should execute all async middlewares in the right order before executing the actual handlers', (done) => {
        const executedMiddlewares = [];
        const handledMessages = [];

        const bus = shared.busFactory();

        bus.registerMiddleware((message, next) => {
            executedMiddlewares.push({ A: message });
            next();
        });

        bus.registerMiddleware((message, next) => {
            executedMiddlewares.push({ B: message });
            next();
        });

        bus.registerMiddleware((message, next) => {
            executedMiddlewares.push({ C: message });
            next();
        });

        bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ X: message });
            next();
        });

        bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ Y: message });
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        bus.handle(message, () => {
            expect(executedMiddlewares).toEqual([
                { A: message },
                { B: message },
                { C: message }
            ]);

            expect(handledMessages[0]).toEqual({ X: message });
            expect(handledMessages[1]).toEqual({ Y: message });

            done();
        });

    });

    it('should execute handlers directly if there are no middlewares', (done) => {
        const handledMessages = [];
        const bus = shared.busFactory();

        bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ A: message });
            next();
        });

        bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ B: message });
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        bus.handle(message, () => {
            expect(handledMessages[0]).toEqual({ A: message });
            expect(handledMessages[1]).toEqual({ B: message });
            done();
        });
    });

    it('should pass error callback to event handler', (done) => {
        const bus = shared.busFactory();

        bus.registerHandler('lorem', (message, callback, error) => {
            error('Error C');
        });

        bus.handle({ type: 'lorem' }, () => {
            fail('Success callback should not be called in this scenario.');
            done();
        }, (error) => {
            expect(error).toBe('Error C');
            done();
        });
    });
});
