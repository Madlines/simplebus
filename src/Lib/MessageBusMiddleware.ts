import {MessageHandlerFunction} from './MessageHandlerFunction';

export interface MessageBusMiddleware<P>  {
    handle: MessageHandlerFunction<P>;
}
