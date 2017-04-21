import {Message, isMessage} from '../src/message';

test('isMessage() should properly detect proper messages', () => {
    const message1: Message = {
        type: 'foo/bar'
    };

    class Message2 implements Message {
        type = 'lorem/ipsum';
    };

    expect(isMessage(message1)).toBe(true);
    expect(isMessage(new Message2())).toBe(true);
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
    };

    expect(isMessage(message1)).toBe(false);
    expect(isMessage(message2)).toBe(false);
    expect(isMessage(new Message3())).toBe(false);
});
