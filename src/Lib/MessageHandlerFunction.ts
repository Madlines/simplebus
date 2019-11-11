import {Message} from './Message';

export type MessageHandlerFunction<P> = (message: Message<P>) => Promise<any> | PromiseLike<any> | any;
