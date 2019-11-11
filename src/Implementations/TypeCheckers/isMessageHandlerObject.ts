import {MessageHandlerObject} from '../../Lib/MessageHandlerObject';

export function isMessageHandlerObject(value: any): value is MessageHandlerObject<any> {
    return 'object' === typeof value
        && null !== value
        && 'function' === typeof value.getSupportedType
        && 'function' === typeof value.handle;
}
