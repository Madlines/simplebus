import {Message} from './Message';

export interface Middleware {
    (message: Message, next: Function, error?: Function): void;
}

export namespace Middleware {
    export const NOT_PROPER_MIDDLEWARE = 'Provided object does not look like middleware.';
    export const isMiddleware = (middleware): boolean => 'function' === typeof middleware;
}

