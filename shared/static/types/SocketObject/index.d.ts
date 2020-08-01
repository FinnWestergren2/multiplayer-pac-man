import { Directions, PlayerStatus, PlayerStatusMap } from "../GameObject";
export declare enum MessageType {
    HELLO = 0,
    PING = 1,
    PONG = 2,
    MAP_REQUEST = 3,
    MAP_RESPONSE = 4,
    PLAYER_INPUT = 5,
    PLAYER_STATUS_UPDATE = 6,
    INVALID = 7
}
export declare type ClientRequest = {
    type: MessageType.PING;
    payload: number;
} | {
    type: MessageType.HELLO;
    payload: {
        id: string;
    };
} | {
    type: MessageType.MAP_REQUEST;
    payload: null;
} | {
    type: MessageType.PLAYER_INPUT;
    payload: {
        id: string;
        dir: Directions;
    };
} | {
    type: MessageType.PLAYER_STATUS_UPDATE;
    payload: {
        playerId: string;
        status: PlayerStatus;
    };
};
export declare type ServerResponse = {
    type: MessageType.PONG;
    payload: number;
} | {
    type: MessageType.HELLO;
    payload: null;
} | {
    type: MessageType.MAP_RESPONSE;
    payload: MapResponse;
} | {
    type: MessageType.INVALID;
    payload: null;
} | {
    type: MessageType.PLAYER_INPUT;
    payload: {
        id: string;
        dir: Directions;
    };
} | {
    type: MessageType.PLAYER_STATUS_UPDATE;
    payload: PlayerStatusMap;
};
export declare type MapResponse = Directions[][];
