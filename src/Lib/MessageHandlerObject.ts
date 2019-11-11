import {MessageBusMiddleware} from './MessageBusMiddleware';

export interface MessageHandlerObject<P> extends MessageBusMiddleware<P> {
   getSupportedType(): string;
}
