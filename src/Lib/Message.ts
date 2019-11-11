// https://github.com/Microsoft/TypeScript/issues/12400
export type Message<P = undefined> = {
    type: string;
} & (P extends undefined ? {} : {payload: P});
