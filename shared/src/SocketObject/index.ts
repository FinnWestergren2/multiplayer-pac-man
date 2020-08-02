import { Directions, PlayerStatus, PlayerStatusMap, StampedInput } from "../GameObject"

// id keep these as numbers to keep the packet size low
export enum MessageType {
    SET_CURRENT_PLAYER,
    PING,
    PONG,
    MAP_REQUEST,
    MAP_RESPONSE,
    PLAYER_INPUT,
    PLAYER_STATUS_UPDATE,
    ADD_PLAYER,
    REMOVE_PLAYER,
    INVALID
}

export type ClientMessage =
    { type: MessageType.PING, payload: number } |
    { type: MessageType.MAP_REQUEST, payload: null } |
    { type: MessageType.PLAYER_INPUT, payload: { playerId: string; input: StampedInput } } |
    { type: MessageType.PLAYER_STATUS_UPDATE, payload: { playerId: string, status: PlayerStatus } }

type PlayerListUpdate =
    { type: MessageType.SET_CURRENT_PLAYER, payload: string } |
    { type: MessageType.REMOVE_PLAYER, payload: string } |
    { type: MessageType.ADD_PLAYER, payload: string }

export type ServerMessage =
    PlayerListUpdate |
    { type: MessageType.PONG, payload: number } |
    { type: MessageType.MAP_RESPONSE, payload: MapResponse } |
    { type: MessageType.INVALID, payload: null } |
    { type: MessageType.PLAYER_INPUT, payload: { playerId: string; input: StampedInput }[] } |
    { type: MessageType.PLAYER_STATUS_UPDATE, payload: PlayerStatusMap }

export type MapResponse = Directions[][];

