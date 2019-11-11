import {MessageBusMiddleware} from '../../src';
import {BaseMessageBus} from '../../src/Implementations/BaseMessageBus';
import {HandlersMap} from '../../src/Lib/HandlersMap';

export class TestMessageBusImplementation extends BaseMessageBus {
    getHandlersMap(): HandlersMap {
        return this.handlersMap;
    }

    getMiddlewareList(): MessageBusMiddleware<any>[] {
        return this.middlewareList;
    }
}
