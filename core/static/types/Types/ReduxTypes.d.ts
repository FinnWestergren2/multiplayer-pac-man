import { Directions, PlayerStatusMap, StampedInput, PlayerStatus } from ".";
import { Store } from "redux";
import { CoordPair } from "./CoordPair";
export declare type MapStore = Store<MapState, MapStateAction>;
export declare type PlayerStore = Store<PlayerState, PlayerStateAction>;
export declare type MapState = {
    mapCells: Directions[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
};
export declare enum MapStateActionTypes {
    REFRESH_MAP = "REFRESH_MAP",
    UPDATE_APP_DIMENSIONS = "UPDATE_APP_DIMENSIONS",
    UPDATE_CELL_DIMENSIONS = "UPDATE_CELL_DIMENSIONS"
}
export declare type AppDimensions = {
    canvasHeight: number;
    canvasWidth: number;
};
export declare type CellDimensions = {
    cellSize: number;
    halfCellSize: number;
};
export declare type MapStateAction = {
    type: MapStateActionTypes.REFRESH_MAP;
    payload: Directions[][];
} | {
    type: MapStateActionTypes.UPDATE_APP_DIMENSIONS;
    payload: AppDimensions;
} | {
    type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS;
    payload: CellDimensions;
};
export declare type PlayerState = {
    playerStatusMap: PlayerStatusMap;
    playerList: string[];
    currentPlayer?: string;
};
export declare enum PlayerStateActionTypes {
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
    SET_PLAYER_STATUS = "SET_PLAYER_STATUS",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID",
    SET_PLAYER_LIST = "SET_PLAYER_LIST",
    SOFT_UPDATE_PLAYER_STATUSES = "SOFT_UPDATE_PLAYER_STATUSES",
    RESOLVE_SOFT_UPDATE = "RESOLVE_SOFT_UPDATE",
    SET_PLAYER_PATH = "SET_PLAYER_PATH",
    POP_PLAYER_PATH = "POP_PLAYER_PATH"
}
export declare type PlayerStateAction = {
    type: PlayerStateActionTypes.UPDATE_PLAYER_STATUS;
    payload: {
        playerId: string;
        status: PlayerStatus;
    };
} | {
    type: PlayerStateActionTypes.SOFT_UPDATE_PLAYER_STATUSES;
    payload: PlayerStatusMap;
} | {
    type: PlayerStateActionTypes.RESOLVE_SOFT_UPDATE;
    payload: string;
} | {
    type: PlayerStateActionTypes.SET_PLAYER_STATUS;
    payload: PlayerStatusMap;
} | {
    type: PlayerStateActionTypes.ADD_PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    };
} | {
    type: PlayerStateActionTypes.ADD_PLAYER;
    payload: string;
} | {
    type: PlayerStateActionTypes.REMOVE_PLAYER;
    payload: string;
} | {
    type: PlayerStateActionTypes.SET_CURRENT_PLAYER_ID;
    payload: string;
} | {
    type: PlayerStateActionTypes.SET_PLAYER_LIST;
    payload: string[];
} | {
    type: PlayerStateActionTypes.SET_PLAYER_PATH;
    payload: {
        playerId: string;
        path: CoordPair[];
    };
} | {
    type: PlayerStateActionTypes.POP_PLAYER_PATH;
    payload: string;
};
