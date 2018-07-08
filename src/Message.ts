export interface Message {
    readonly type: string;
}

export namespace Message {
    export const NOT_PROPER_MESSAGE = 'Provided value does not look like proper message.';
    export const isMessage = (message): boolean => 'object' === typeof message && 'string' === typeof message.type;
}

