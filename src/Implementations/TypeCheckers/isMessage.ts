import {Message} from '../../Lib/Message';

export function isMessage(value: any): value is Message<any> {
    return 'object' === typeof value
        && null !== value
        && 'string' === typeof value.type;
        // ignore the payload
}
