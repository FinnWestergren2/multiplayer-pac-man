export declare enum MessageType {
    PING = "PING",
    PONG = "PONG",
    HELLO = "HELLO"
}
export declare type ClientRequest = {
    type: MessageType.PING;
    payload: number;
} | {
    type: MessageType.HELLO;
    payload: null;
};
export declare type ServerResponse = {
    type: MessageType.PONG;
    payload: number;
} | {
    type: MessageType.HELLO;
    payload: null;
};
