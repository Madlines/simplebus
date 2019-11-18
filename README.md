# SimpleBus by Madlines
This library is inspired by PHP library called SimpleBus (https://github.com/SimpleBus).

It allows you to easily setup Message Buses (like Command Buses and Evens Buses) with
handlers and middleware, and run messages through them.

# Message
*Message* is a simple JS object that needs to have a type and, optionally, a payload, e.g.:
```js
const message = {
    type: 'foo',
    payload: {lorem: 'ipsum'},
};
```

## Command Bus
Command Bus is a variation of Message Bus that allows you to setup *exactly one* handler
per type. It is going to crash if you try to handle a message for which there are no handlers.
It is also going to crash if you try to register more than one handler per type.

Usage:

```js
// Create a bus
import {CommandBus} from 'madlines-simplebus';
const bus = new CommandBus();

// You can register handlers as callbacks
// Those callbacks can (but don't have to) return promises, if your handler needs to
// be asynchronous. Then Command Bus will wait for completion of such handler.
bus.registerHandler('foo', (command) => {
    console.log('Handling message of type foo', command);
    // Your actual logic goes here
});

// You can also register handlers as objects.
// Useful if you'd like for your handlers to be services within a DI container.
class BarHandler {
    getSupportedType() {
        return 'bar';
    }

    // The `handle` method may or may not return a promise, it's up to you and your needs.
    handle(command) {
       console.log('Handling message of type bar', command);
        // Your actual logic goes here
    }
}

const barHandler = new BarHandler();
bus.registerHandler(barHandler); // you don't need to specify a type, the handler is doing that already

// Once you've got your your handlers registered, you can handle a command.
bus.handle(message)
    .then(() => console.log('The command has been handled'))
    .catch((e) => console.error('Failed to handle a command', e));
```

Keep in mind that your handlers aren't suppose to return any value

### Unregistering handlers
In order to unregister a handler, use the `unregisterHandler` method, e.g.:
```js
// Keep in mind that handler needs to be the same function or object that you used to register it,
// just like with `addEventListener` and `removeEventListener`.
bus.unregisterHandler(barHandler);
```

## Event Bus
Now Event Bus is pretty much the same as Command Bus, except it doesn't care how many handlers for a single type
you will register, it will run your message through every registered handler, one-by-one.

### Message Subscriber
However, Event Bus can also provide you with the object that is more friendly when it comes to unregistering handlers.

```js
import {EventBus} from 'madlines-simplebus';
const bus = new EventBus();
const subscriber = bus.createSubscriber();

subscriber.on('lorem', event => {
    console.log('Handling message of type lorem', event);
});

subscriber.on('lorem', event => {
    console.log('Handling message of type lorem with another handler', event);
});

subscriber.on('ipsum', event => {
    console.log('Handling message of type ipsum', event);
});

// Handle the message with the parent event bus
bus.handle(message)
    .then(() => console.log('The event has been handled'))
    .catch((e) => console.error('Failed to handle an event', e));

subscriber.destroy(); // It is unregistering all the handlers from that subscriber's instance
```

## Middleware
A middleware is a kind of handler that is triggered for every message that is going through a bus, before the
message reaches the actual message handlers. It might be useful for logging, synchronization, permissions check
and more.
```js
bus.registerMiddleware({
    handle: (message) => {
        console.log('Processing a message inside a middleware', message);
    },
});
```
