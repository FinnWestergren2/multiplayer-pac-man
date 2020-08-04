import { Directions, PlayerStatusMap, PlayerInputHistory, StampedInput, PlayerStatus } from ".";
import { Store } from "redux";
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
    playerInputHistory: PlayerInputHistory;
    playerList: string[];
    currentPlayer?: string;
    mostRecentInput: {
        playerId: string;
        input: StampedInput;
    } | null;
};
export declare enum PlayerStateActionTypes {
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID",
    SET_PLAYER_LIST = "SET_PLAYER_LIST"
}
export declare type PlayerStateAction = {
    type: PlayerStateActionTypes.UPDATE_PLAYER_STATUS;
    payload: {
        playerId: string;
        status: PlayerStatus;
    };
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
};
