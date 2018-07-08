import {Message} from '../src/Message';

test('isMessage() should properly detect proper messages', () => {
    const message1: Message = {
        type: 'foo/bar'
    };

    class Message2 implements Message {
        type = 'lorem/ipsum';
    }

    expect(Message.isMessage(message1)).toBe(true);
    expect(Message.isMessage(new Message2())).toBe(true);
});

test('isMessage() should properly detect improper messages', () => {
    const message1 = {
        typeX: 'foo/bar'
    };

    const message2 = {
        typeX: 123
    };

    class Message3 {
        typeY = 'lorem/ipsum';
    }

    expect(Message.isMessage(message1)).toBe(false);
    expect(Message.isMessage(message2)).toBe(false);
    expect(Message.isMessage(new Message3())).toBe(false);
});
