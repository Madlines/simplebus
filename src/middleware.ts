import {Message} from './message';

export const isMiddlware = (middleware): boolean => 'function' === typeof middleware;

export interface Middleware {
    (message: Message, next: Function, error?: Function): void;
}

// TODO NO_PROPER -> NOT_PROPER...
export const NO_PROPER_MIDDLEWARE = 'Provided object does not look like middleware.';
