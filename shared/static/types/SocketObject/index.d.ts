import { Directions, PlayerStatusMap } from "../GameObject";
export declare enum MessageType {
    HELLO = 0,
    PING = 1,
    PONG = 2,
    MAP_REQUEST = 3,
    MAP_RESPONSE = 4,
    INVALID = 5
}
export declare type ClientRequest = {
    type: MessageType.PING;
    payload: number;
} | {
    type: MessageType.HELLO;
    payload: null;
} | {
    type: MessageType.MAP_REQUEST;
    payload: string[];
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
};
export declare type MapResponse = {
    map: Directions[][];
    startLocations: PlayerStatusMap;
};
