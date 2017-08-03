export const isMessage = (message): boolean => 'object' === typeof message && 'string' === typeof message.type;

export interface Message {
    readonly type: string;
}

export const NOT_PROPER_MESSAGE = 'Provided value does not look like proper message.';
