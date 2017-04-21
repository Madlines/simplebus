import {Message} from './message';

export const isMessageHandler = (callback): boolean => 'function' === typeof callback;

export interface MessageHandler {
    (message: Message, callback: Function, error?: Function): void;
}

export const NO_PROPER_HANDLER = 'Provided handler is not a proper message handler';
