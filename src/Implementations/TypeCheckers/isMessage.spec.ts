import {expect} from 'chai';
import {Message} from '../../Lib/Message';
import {isMessage} from './isMessage';

describe('isMessage', () => {
    it('should report proper messages as such', () => {
        const message1: Message = {type: 'foo'};
        const message2: Message<{lorem: string}> = {type: 'bar', payload: {lorem: 'ipsum'}};

        class TestMessage implements Message<{dolor: string}> {
            readonly type: string;
            constructor(readonly payload: {dolor: string}) {
                this.type = 'TestMessage';
            }
        }
        const message3: Message<{dolor: string}> = new TestMessage({dolor: 'amet'});

        expect(isMessage(message1)).to.deep.equal(true);
        expect(isMessage(message2)).to.deep.equal(true);
        expect(isMessage(message3)).to.deep.equal(true);
    });

    it('should report improper messages as such', () => {
        const message1 = {};
        const message2 = {foo: 'bar', payload: {lorem: 'ipsum'}};

        // tslint:disable-next-line:max-classes-per-file
        class TestMessage {
            constructor(readonly payload: {dolor: string}) {
            }
        }
        const message3 = new TestMessage({dolor: 'amet'});

        expect(isMessage(message1)).to.deep.equal(false);
        expect(isMessage(message2)).to.deep.equal(false);
        expect(isMessage(message3)).to.deep.equal(false);
    });
});
