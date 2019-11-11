import {MessageSubscriber} from '../Lib/MessageSubscriber';
import {BaseMessageBus} from './BaseMessageBus';
import {MessageSubscriberImplementation} from './MessageSubscriberImplementation';

export class EventBus extends BaseMessageBus {
    createSubscriber(): MessageSubscriber {
        return new MessageSubscriberImplementation(this);
    }
}
