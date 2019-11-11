import {EventBus, MessageBusMiddleware} from '../../src';
import {HandlersMap} from '../../src/Lib/HandlersMap';

export class TestEventBusImplementation extends EventBus {
    getHandlersMap(): HandlersMap {
        return this.handlersMap;
    }

    getMiddlewareList(): MessageBusMiddleware<any>[] {
        return this.middlewareList;
    }
}
