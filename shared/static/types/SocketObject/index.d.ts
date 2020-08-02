import { Directions, PlayerStatus, PlayerStatusMap, StampedInput } from "../GameObject";
export declare enum MessageType {
    SET_CURRENT_PLAYER = 0,
    PING = 1,
    PONG = 2,
    MAP_REQUEST = 3,
    MAP_RESPONSE = 4,
    PLAYER_INPUT = 5,
    PLAYER_STATUS_UPDATE = 6,
    ADD_PLAYER = 7,
    REMOVE_PLAYER = 8,
    INVALID = 9
}
export declare type ClientMessage = {
    type: MessageType.PING;
    payload: number;
} | {
    type: MessageType.MAP_REQUEST;
    payload: null;
} | {
    type: MessageType.PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    };
} | {
    type: MessageType.PLAYER_STATUS_UPDATE;
    payload: {
        playerId: string;
        status: PlayerStatus;
    };
};
declare type PlayerListUpdate = {
    type: MessageType.SET_CURRENT_PLAYER;
    payload: string;
} | {
    type: MessageType.REMOVE_PLAYER;
    payload: string;
} | {
    type: MessageType.ADD_PLAYER;
    payload: string;
};
export declare type ServerMessage = PlayerListUpdate | {
    type: MessageType.PONG;
    payload: number;
} | {
    type: MessageType.MAP_RESPONSE;
    payload: MapResponse;
} | {
    type: MessageType.INVALID;
    payload: null;
} | {
    type: MessageType.PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    }[];
} | {
    type: MessageType.PLAYER_STATUS_UPDATE;
    payload: PlayerStatusMap;
};
export declare type MapResponse = Directions[][];
export {};
