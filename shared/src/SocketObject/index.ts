import { Directions, PlayerStatusMap } from "../GameObject"

export enum MessageType {
    HELLO,
    PING,
    PONG,
    MAP_REQUEST,
    MAP_RESPONSE,
    INVALID
}

export type ClientRequest = 
    { type: MessageType.PING, payload: number} |
    { type: MessageType.HELLO, payload: null} |
    { type: MessageType.MAP_REQUEST, payload: string[] }


export type ServerResponse = 
    { type: MessageType.PONG, payload: number } |
    { type: MessageType.HELLO, payload: null } |
    { type: MessageType.MAP_RESPONSE, payload: MapResponse } |
    { type: MessageType.INVALID, payload: null }

export type MapResponse = {
    map: Directions[][],
    startLocations: PlayerStatusMap
}

