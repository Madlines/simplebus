import {Message} from '../../src';

export class TestMessageHandlerLogger {
    readonly list: [string, Message<any>][] = [];

    log<P>(handlerTag: string, message: Message<P>) {
        this.list.push([handlerTag, message]);
    }
}
