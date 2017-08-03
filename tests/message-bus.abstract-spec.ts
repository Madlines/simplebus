import { MessageBus } from '../src/message-bus';
import { NOT_PROPER_HANDLER } from '../src/message-handler';
import { NOT_PROPER_MIDDLEWARE } from '../src/middleware';

export const registerAbstractTests = (shared) => {
    it('should only allow to register handlers that look like handlers',  () => {
        const bus = shared.busFactory();
        bus.registerHandler('foo', () => { });
        expect(() => bus.registerHandler.call(bus, 'bar', 'notAHandler')).toThrow(NOT_PROPER_HANDLER);
    });

    it('should only allow to register middlewares that look like middlewares', () => {
        const bus = shared.busFactory();
        bus.registerMiddleware(() => { });
        expect(() => bus.registerMiddleware.call(bus, 'notAMiddleware')).toThrow(NOT_PROPER_MIDDLEWARE);
    });

    it('should only handle something that looks like message', () => {
        const bus = shared.busFactory();
        expect(() => bus.handle.call(bus, 'foo'))
            .toThrow('Provided value does not look like proper message.');
    });

    it('should stop processing message if one of middlewares will trigger error callback', (done: Function) => {
        const bus = shared.busFactory();
        const executed = [];
        let handledMessage;

        bus.registerMiddleware((message, next) => {
            executed.push({ A: message });
            next();
        });

        bus.registerMiddleware((message, next, error) => {
            error('Error B');
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
            fail('Success callback should not be called in this scenario.');
        }, (error) => {
            expect(error).toBe('Error B');
            done();
        });
    });

    it('should call default error callback if one is set and no error handler is set with "handle" method', (done) => {
        const bus = shared.busFactory();

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
        const bus = shared.busFactory();

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

    it('should be able to deal with results using promises', (done) => {
        const bus = shared.busFactory();

        bus.registerHandler('amet', (): Promise<any> => {
            return new Promise((resolve) => {
                resolve('test result');
            });
        });

        const message = {type: 'amet'};
        bus.handle(message, () => {
            done();
        }, (err) => {
            fail('Error callback should not be called in this scenario');
        });
    });

    it('should execute error callback if handler returns later-rejected promise', (done) => {
        const bus = shared.busFactory();

        bus.registerHandler('amet2', (): Promise<any> => {
            return new Promise((_, reject) => {
                reject('test error');
            });
        });

        const message = {type: 'amet2'};
        bus.handle(message, () => {
            fail('Success callback should not be called in this scenario');
        }, (err) => {
            expect(err).toEqual('test error');
            done();
        });
    });
};
