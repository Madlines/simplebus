# SimpleBus by Madlines
This library is inspired by PHP library called SimpleBus (https://github.com/SimpleBus).

## Command Bus
Command Bus allows you to register command handlers.
Each handler handles exactly one type of command.
During runtime you can tell it to handle a specific command. It will find a proper command handler and execute it.

Example:

```ts
import {CommandBus, Message} from 'madlines-simplebus';

// Command should look like an order - you tell the system what to do.
// Each message has to have a type property - that's how message bus will distinguish it.
interface HelloCommand extends Message {
    type: 'HELLO';
    payload: {
        name: string;
    }
}

interface GoodByeCommand extends Message {
    type: 'GOODBYE';
    payload: {
        name: string;
    }
}

const commandBus = new CommandBus();

commandBus.registerHandler<HelloCommand>('HELLO', (command) => {
    console.log('Hello ' + command.payload.name); // do whatever you want with a command. It might be an async operation.
    return Promise.resolve(); // One way to resolve a handler is to return a promise.
});

commandBus.registerHandler('GOODBYE', (command: GoodByeCommand, next, error) => {
    console.log('Good bye ' + command.payload.name); // do whatever you want with a command. It might be an async operation.
    next(); // Another way to resolve a handler is to call either next() or error() callback function;
});

const hello = {
    type: 'HELLO',
    payload: {
        name: 'Billy'
    }
};

const goodBye = {
    type: 'GOODBYE',
    payload: {
        name: 'Alice'
    }
};

commandBus.handle(hello, () => {
    // Command Handler for HelloCommand has been executed and it is done by now
}, onError);

commandBus.handle(goodBye, () => {
    // Command Handler for GoodByeCommand has been executed and it is done by now
}, onError);

function onError(e) {
    console.error(e);
}

```

## Event Bus
Event Bus works almost the same way as Command Bus but you can register multiple event handlers per one type of event or you can register no event handlers at all.
During runtime you can tell Event Bus to handle an event.
Event Bus will find every handler associated with given type of event and execute them all - one after another.

Example:

```ts
import {EventBus, Message} from 'madlines-simplebus';

// Event is something that happend - hence the past tense.
interface TheThinkJustHappenedEvent extends Message {
    type: 'THE_THINK_JUST_HAPPENED';
    payload: {
        result: string;
    }
}

const eventBus = new EventBus();

eventBus.registerHandler<TheThinkJustHappenedEvent>('THE_THINK_JUST_HAPPENED', (event) => {
    console.log('Doing something as a reaction to an event with this result: ' + event.payload.result);
    return Promise.resolve();
});

eventBus.registerHandler<TheThinkJustHappenedEvent>('THE_THINK_JUST_HAPPENED', (event, next) => {
    console.log('Doing something else as a reaction to an event with this result: ' + event.payload.result);
    next();
});

const event = {
    type: 'THE_THINK_JUST_HAPPENED',
    payload: {
        result: 'The details of this event'
    }
};

eventBus.handle(event, () => {
    // Both handlers associated with TheThinkJustHappenedEvent has been executed by now
}, onError);


function onError(e) {
    console.error(e);
}

```

## Middleware
You can register any number of middleware in a command bus.
Each of them will be executed - one after another - when you tell a message bus to handle any kind of message.
When all middleware are done message will be moved to proper handler or handlers.

Example:

```ts
import {CommandBus} from 'madlines-simplebus';

const commandBus = new CommandBus();

commandBus.registerMiddleware((message, next) => {
    console.log(message); // Do something with a message then...
    next(); // ...move on to the next middleware or - if there no more middleware - move to the actual handler.
});

// Register more handlers and handle messages just like in examples above

```

## Default error handler
If you want to set up one callback for handling errors you can easily do it.
Default error handler will be used if there is no other error callback specified with `handle` method.

```ts
import {CommandBus} from 'madlines-simplebus';

const commandBus = new CommandBus();
commandBus.registerDefaultErrorHandler((e) => {
    console.error(e);
});
```
## Unregistering handlers
To unregister previously registered handler use `unregisterHandler` method and pass
the same set of params as you passed to `registerHandler` method.
```
import {EventBus, Message} from 'madlines-simplebus';
const eventBus = new EventBus(); // works the same for CommandBus as well
const handler = (message) => {
    // The handler's code goes here...
};


eventBus.registerHandler('myEventType', handler);
// later on
eventBus.unregisterHandler('myEventType', handler);

```

