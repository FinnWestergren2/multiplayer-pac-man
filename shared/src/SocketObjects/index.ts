export enum MessageType {
    PING = "PING",
    PONG = "PONG"
}

export type ClientRequest = 
    { type: MessageType.PING, payload: number}

export type ServerResponse = 
    { type: MessageType.PONG, payload: number}
