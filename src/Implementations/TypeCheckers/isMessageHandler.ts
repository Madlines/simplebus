import {MessageHandler} from '../../Lib/MessageHandler';
import {isMessageHandlerFunction} from './isMessageHandlerFunction';
import {isMessageHandlerObject} from './isMessageHandlerObject';

export function isMessageHandler(value: any): value is MessageHandler<any> {
    return isMessageHandlerFunction(value) || isMessageHandlerObject(value);
}
