import { MessageBus } from '../src/message-bus';
import { EventBus } from '../src/event-bus';
import { NO_PROPER_MESSAGE } from '../src/message';
import { registerAbstractTests } from './message-bus-abstract-spec';

describe('EventBus', () => {
    const shared: {
        bus?: MessageBus;
    } = {};

    beforeEach(() => {
        shared.bus = new EventBus();
    });

    registerAbstractTests(shared);

    it('should just trigger success callback no handler is registered for command being handled', (done) => {
        shared.bus.registerHandler('bar', () => { });
        shared.bus.handle({ type: 'foo' }, () => {
            done();
        });
    });

    it('should execute all async middlewares in the right order before executing the actual handlers', (done) => {
        const executedMiddlewares = [];
        const handledMessages = [];

        shared.bus.registerMiddleware((message, next) => {
            executedMiddlewares.push({ A: message });
            next();
        });

        shared.bus.registerMiddleware((message, next) => {
            executedMiddlewares.push({ B: message });
            next();
        });

        shared.bus.registerMiddleware((message, next) => {
            executedMiddlewares.push({ C: message });
            next();
        });

        shared.bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ X: message });
            next();
        });

        shared.bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ Y: message });
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        shared.bus.handle(message, () => {
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

        shared.bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ A: message });
            next();
        });

        shared.bus.registerHandler('lorem', (message, next) => {
            handledMessages.push({ B: message });
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        shared.bus.handle(message, () => {
            expect(handledMessages[0]).toEqual({ A: message });
            expect(handledMessages[1]).toEqual({ B: message });
            done();
        });
    });

    it('should pass error callback to event handler', (done) => {
        shared.bus.registerHandler('lorem', (message, callback, error) => {
            error('Error C');
        });

        shared.bus.handle({ type: 'lorem' }, () => {
            fail('Success callback should not be called in this scenario.');
            done();
        }, (error) => {
            expect(error).toBe('Error C');
            done();
        });
    });
});
