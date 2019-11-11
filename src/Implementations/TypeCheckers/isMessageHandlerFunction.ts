import {MessageHandlerFunction} from '../../Lib/MessageHandlerFunction';

export function isMessageHandlerFunction(value: any): value is MessageHandlerFunction<any> {
    return 'function' === typeof value;
}
