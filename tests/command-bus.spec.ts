import { MessageBus } from '../src/message-bus';
import { CommandBus } from '../src/command-bus';
import { NOT_PROPER_MIDDLEWARE } from '../src/middleware';
import { NOT_PROPER_HANDLER } from '../src/message-handler';
import { NOT_PROPER_MESSAGE } from '../src/message';
import { registerAbstractTests } from './message-bus.abstract-spec';

describe('CommandBus', () => {
    const shared: {
        busFactory?(): MessageBus;
    } = {};

    beforeEach(() => {
        shared.busFactory = () => new CommandBus();
    });

    registerAbstractTests(shared);

    it('should allow to register only one handler per type', () => {
        const bus = shared.busFactory();

        bus.registerHandler('foo', () => { });
        expect(() => bus.registerHandler('foo', () => { }))
            .toThrow('Handler for type foo is already registered.');
    });

    it('should throw an error if no handler is registered for command being handled', () => {
        const bus = shared.busFactory();

        bus.registerHandler('bar', () => { });
        expect(() => bus.handle({ type: 'foo' }, () => { }))
            .toThrow('No handler is registered for message of type foo');
    });

    it('should execute all async middlewares in the right order before executing the actual handler', (done) => {
        const bus = shared.busFactory();

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
        const bus = shared.busFactory();
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
