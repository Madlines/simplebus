import {Message, MessageBus} from '../../src';
import {TestBarHandler} from './TestBarHandler';
import {TestBarHandler2} from './TestBarHandler2';
import {TestFooHandler} from './TestFooHandler';
import {TestMessageBusImplementation} from './TestMessageBusImplementation';
import {TestMessageHandlerLogger} from './TestMessageHandlerLogger';
import {TestMiddlewareA} from './TestMiddlewareA';
import {TestMiddlewareB} from './TestMiddlewareB';

export function configureBusForTesting(): {
    bus: MessageBus,
    handlerBar: TestBarHandler,
    handlerBar2: TestBarHandler,
    handlerFoo: TestFooHandler,
    logger: TestMessageHandlerLogger,
    messageBar: Message<{bar: string}>,
    messageFoo: Message<{foo: string}>,
    middlewareA: TestMiddlewareA,
    middlewareB: TestMiddlewareB,
} {
    const bus = new TestMessageBusImplementation();
    const logger = new TestMessageHandlerLogger();

    const middlewareA = new TestMiddlewareA(logger);
    const middlewareB = new TestMiddlewareB(logger);
    const handlerBar = new TestBarHandler(logger);
    const handlerBar2 = new TestBarHandler2(logger);
    const handlerFoo = new TestFooHandler(logger);

    const messageFoo: Message<{foo: string}> = {
        payload: {foo: 'lorem'},
        type: 'foo',
    };

    const messageBar: Message<{bar: string}> = {
        payload: {bar: 'ipsum'},
        type: 'bar',
    };

    bus.registerMiddleware(middlewareA);
    bus.registerMiddleware(middlewareB);

    bus.registerHandler(handlerBar);
    bus.registerHandler(handlerBar2);
    bus.registerHandler(handlerFoo);

    return {
        bus,
        handlerBar,
        handlerBar2,
        handlerFoo,
        logger,
        messageBar,
        messageFoo,
        middlewareA,
        middlewareB,
    };
}
