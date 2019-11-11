import {MessageHandler} from './MessageHandler';

export interface HandlersMap {
    [type: string]: (MessageHandler<any>[]);
}
