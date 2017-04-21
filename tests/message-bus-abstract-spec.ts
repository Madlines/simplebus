import { MessageBus } from '../src/message-bus';
import { NO_PROPER_HANDLER } from '../src/message-handler';
import { NO_PROPER_MIDDLEWARE } from '../src/middleware';

export const registerAbstractTests = (shared) => {
    it('should only allow to register handlers that look like handlers',  () => {
        shared.bus.registerHandler('foo', () => { });
        expect(() => shared.bus.registerHandler.call(shared.bus, 'bar', 'notAHandler')).toThrow(NO_PROPER_HANDLER);
    });

    it('should only allow to register middlewares that look like middlewares', () => {
        shared.bus.registerMiddleware(() => { });
        expect(() => shared.bus.registerMiddleware.call(shared.bus, 'notAMiddleware')).toThrow(NO_PROPER_MIDDLEWARE);
    });

    it('should only handle something that looks like message', () => {
        expect(() => shared.bus.handle.call(shared.bus, 'foo'))
            .toThrow('Provided value does not look like proper message.');
    });

    it('should stop processing message if one of middlewares will trigger error callback', (done: Function) => {
        const executed = [];
        let handledMessage;

        shared.bus.registerMiddleware((message, next) => {
            executed.push({ A: message });
            next();
        });

        shared.bus.registerMiddleware((message, next, error) => {
            error('Error B');
            next();
        });

        shared.bus.registerMiddleware((message, next) => {
            executed.push({ C: message });
            next();
        });

        shared.bus.registerHandler('lorem', (message, next) => {
            handledMessage = message;
            next();
        });

        const message = { type: 'lorem', foo: 'bar' };
        shared.bus.handle(message, () => {
            fail('Success callback should not be called in this scenario.');
            done();
        }, (error) => {
            expect(error).toBe('Error B');
            done();
        });
    });

    it('should call default error callback if one is set and no error handler is set with "handle" method', (done) => {
        const bus = shared.bus;

        let handledMessage;
        const message = {type: 'foo'};

        bus.registerDefaultErrorHandler((error) => {
            expect(error).toBe('Error C');
            expect(handledMessage).toBe(message);
            done();
        });

        bus.registerHandler('foo', (message, next, error) => {
            handledMessage = message;
            error('Error C');
        });

        bus.handle(message);
    });

    it('should not call default error handler if one is set with "handle"', (done) => {
        const bus = shared.bus;

        let handledMessage;
        const message = {type: 'foo'};

        bus.registerDefaultErrorHandler((error) => {
            fail('Default error handler should not be called in this scenario');
        });

        bus.registerHandler('foo', (message, next, error) => {
            handledMessage = message;
            error('Error D');
        });

        bus.handle(message, () => { }, (error) => {
            expect(error).toBe('Error D');
            expect(handledMessage).toBe(message);
            done();
        });
    });
};
