import {MessageHandlerFunction} from './MessageHandlerFunction';
import {MessageHandlerObject} from './MessageHandlerObject';

export type MessageHandler<P> = MessageHandlerFunction<P> | MessageHandlerObject<P>;
