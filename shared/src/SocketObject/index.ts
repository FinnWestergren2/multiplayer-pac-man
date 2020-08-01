import { Directions, PlayerStatus, PlayerStatusMap } from "../GameObject"

// id keep these as numbers to keep the packet size low
export enum MessageType {
    HELLO,
    PING,
    PONG,
    MAP_REQUEST,
    MAP_RESPONSE,
    PLAYER_INPUT,
    PLAYER_STATUS_UPDATE,
    INVALID
}

export type ClientRequest =
    { type: MessageType.PING, payload: number } |
    { type: MessageType.HELLO, payload: { id: string } } |
    { type: MessageType.MAP_REQUEST, payload: null } |
    { type: MessageType.PLAYER_INPUT, payload: { id: string; dir: Directions } } |
    { type: MessageType.PLAYER_STATUS_UPDATE, payload: { playerId: string, status: PlayerStatus } }



export type ServerResponse =
    { type: MessageType.PONG, payload: number } |
    { type: MessageType.HELLO, payload: null } |
    { type: MessageType.MAP_RESPONSE, payload: MapResponse } |
    { type: MessageType.INVALID, payload: null } |
    { type: MessageType.PLAYER_INPUT, payload: { id: string; dir: Directions } } |
    { type: MessageType.PLAYER_STATUS_UPDATE, payload: PlayerStatusMap }


export type MapResponse = Directions[][];

