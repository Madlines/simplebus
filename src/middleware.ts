import {Message} from './message';

export const isMiddleware = (middleware): boolean => 'function' === typeof middleware;

export interface Middleware {
    (message: Message, next: Function, error?: Function): void;
}

export const NOT_PROPER_MIDDLEWARE = 'Provided object does not look like middleware.';
