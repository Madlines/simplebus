import {Message} from './Message';

export interface MessageHandler<T extends Message> {
    (message: T, callback?: Function, error?: Function): Promise<any> | PromiseLike<any> | any;
}

export namespace MessageHandler {
    export const NOT_PROPER_HANDLER = 'Provided handler is not a proper message handler';
    export const isMessageHandler = (callback): boolean => 'function' === typeof callback;
}

