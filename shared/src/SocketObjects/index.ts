import { Directions } from "../GameObjects"

export enum MessageType {
    PING = "PING",
    PONG = "PONG"
}

export type clientRequest = 
    { type: MessageType.PING, payload: null}

export type serverResponse = 
    { type: MessageType.PONG, payload: number}
