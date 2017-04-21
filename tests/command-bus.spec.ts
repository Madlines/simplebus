import { MessageBus } from '../src/message-bus';
import { CommandBus } from '../src/command-bus';
import { NO_PROPER_MIDDLEWARE } from '../src/middleware';
import { NO_PROPER_HANDLER } from '../src/message-handler';
import { NO_PROPER_MESSAGE } from '../src/message';
import { registerAbstractTests } from './message-bus-abstract-spec';

describe('CommandBus', () => {
    const shared: {
        bus?: MessageBus;
    } = {};

    beforeEach(() => {
        shared.bus = new CommandBus();
    });

    registerAbstractTests(shared);

    it('should allow to register only one handler per type', () => {
        const bus = new CommandBus();

        bus.registerHandler('foo', () => { });
        expect(() => bus.registerHandler('foo', () => { }))
            .toThrow('Handler for type foo is already registered.');
    });

    it('should throw an error if no handler is registered for command being handled', () => {
        const bus = new CommandBus();

        bus.registerHandler('bar', () => { });
        expect(() => bus.handle({ type: 'foo' }, () => { }))
            .toThrow('No handler is registered for message of type foo');
    });

    it('should execute all async middlewares in the right order before executing the actual handler', (done) => {
        const bus = new CommandBus();

        let executed = [];
        let handledMessage;

        bus.registerMiddleware((message, next) => {
            executed.push({ A: message });
            next();
        });

        bus.registerMiddleware((message, next) => {
            executed.push({ B: message });
            next();
        });

        bus.registerMiddleware((message, next) => {
            executed.push({ C: message });
            next();
        });

        bus.registerHandler('lorem', (message, next) => {
            handledMessage = message;
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        bus.handle(message, () => {
            expect(executed).toEqual([
                { A: message },
                { B: message },
                { C: message }
            ]);

            expect(handledMessage).toEqual(message);
            done();
        });

    });

    it('should execute handler directly if there are no middlewares', (done) => {
        const bus = new CommandBus();
        let handledMessage;

        bus.registerHandler('lorem', (message, next) => {
            handledMessage = message;
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        bus.handle(message, () => {
            expect(handledMessage).toEqual(message);
            done();
        });
    });

    it('should pass error callback to command handler', (done) => {
        const bus = new CommandBus();

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
