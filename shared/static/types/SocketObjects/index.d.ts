export declare enum MessageType {
    PING = "PING",
    PONG = "PONG"
}
export declare type ClientRequest = {
    type: MessageType.PING;
    payload: number;
};
export declare type ServerResponse = {
    type: MessageType.PONG;
    payload: number;
};
