import { Directions, StampedInput, PlayerStatusMap, CoordPair, PlayerLocationMap } from "../Types";
export declare enum MessageType {
    INIT_PLAYER = "INIT_PLAYER",
    PING = "PING",
    PONG = "PONG",
    MAP_REQUEST = "MAP_REQUEST",
    MAP_RESPONSE = "MAP_RESPONSE",
    PLAYER_INPUT = "PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    INVALID = "INVALID",
    CLIENT_PERCEPTION_UPDATE = "CLIENT_PERCEPTION_UPDATE",
    STATE_OVERRIDE = "STATE_OVERRIDE",
    STATE_CORRECTION = "STATE_CORRECTION"
}
export declare type ClientMessage = {
    type: MessageType.PING;
    payload: {
        time: number;
        playerId: string;
    };
} | {
    type: MessageType.MAP_REQUEST;
    payload: null;
} | {
    type: MessageType.CLIENT_PERCEPTION_UPDATE;
    payload: {
        locationMap: {
            [playerId: string]: CoordPair;
        };
        timeStamp: number;
    };
} | {
    type: MessageType.PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    };
};
declare type PlayerListUpdate = {
    type: MessageType.INIT_PLAYER;
    payload: {
        currentPlayerId: string;
        fullPlayerList: string[];
        playerStatusMap: PlayerStatusMap;
    };
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
    type: MessageType.STATE_OVERRIDE;
    payload: PlayerStatusMap;
} | {
    type: MessageType.STATE_CORRECTION;
    payload: {
        soft: PlayerLocationMap;
        hard: PlayerStatusMap;
    };
} | {
    type: MessageType.PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    };
};
export declare type MapResponse = Directions[][];
export {};
