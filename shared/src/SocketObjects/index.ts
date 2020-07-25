export enum MessageType {
    PING = "PING",
    PONG = "PONG",
    HELLO = "HELLO"
}

export type ClientRequest = 
    { type: MessageType.PING, payload: number} |
    { type: MessageType.HELLO, payload: null}


export type ServerResponse = 
    { type: MessageType.PONG, payload: number} |
    { type: MessageType.HELLO, payload: null}

