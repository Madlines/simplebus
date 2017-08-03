import {Message} from './message';

export const isMessageHandler = (callback): boolean => 'function' === typeof callback;

export interface MessageHandler {
    (message: Message, callback?: Function, error?: Function): Promise<any> | PromiseLike<any> | any;
}

export const NOT_PROPER_HANDLER = 'Provided handler is not a proper message handler';
