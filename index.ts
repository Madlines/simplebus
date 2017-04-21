import * as commandBus from './src/command-bus';
import * as eventBus from './src/event-bus';
import * as messageBus from './src/message-bus';
import * as messageHandler from './src/message-handler';
import * as message from './src/message';
import * as middleware from './src/middleware';

export const simplebus = {
    commandBus: commandBus,
    eventBus: commandBus,
    messageBus: commandBus,
    messageHandler: messageHandler,
    message: message,
    middleware: middleware,
};

export default simplebus;