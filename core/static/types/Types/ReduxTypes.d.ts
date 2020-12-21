import { Store } from "redux";
import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
import { ObjectDict as Dictionary, ObjectStatus as ObjectStatus, StampedInput } from "./GameState";
export declare type MapStore = Store<MapState, MapStateAction>;
export declare type PlayerStore = Store<GameState, GameStateAction>;
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
export declare type GameState = {
    objectStatusDict: Dictionary<ObjectStatus>;
    playerList: string[];
    currentPlayer?: string;
    objectPathDict: Dictionary<CoordPair[]>;
};
export declare enum GameStateActionTypes {
    SET_OBJECT_STATUS = "SET_OBJECT_STATUS",
    SET_OBJECT_STATUSES = "SET_OBJECT_STATUSES",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID",
    SET_PLAYER_LIST = "SET_PLAYER_LIST",
    SOFT_SET_OBJECT_STATUSES = "SOFT_SET_OBJECT_STATUSES",
    RESOLVE_SOFT_UPDATE = "RESOLVE_SOFT_UPDATE",
    SET_OBJECT_PATH = "SET_OBJECT_PATH",
    POP_OBJECT_PATH = "POP_OBJECT_PATH"
}
export declare type GameStateAction = {
    type: GameStateActionTypes.SET_OBJECT_STATUS;
    payload: {
        playerId: string;
        status: ObjectStatus;
    };
} | {
    type: GameStateActionTypes.SOFT_SET_OBJECT_STATUSES;
    payload: Dictionary<ObjectStatus>;
} | {
    type: GameStateActionTypes.RESOLVE_SOFT_UPDATE;
    payload: string;
} | {
    type: GameStateActionTypes.SET_OBJECT_STATUSES;
    payload: Dictionary<ObjectStatus>;
} | {
    type: GameStateActionTypes.ADD_PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    };
} | {
    type: GameStateActionTypes.ADD_PLAYER;
    payload: string;
} | {
    type: GameStateActionTypes.REMOVE_PLAYER;
    payload: string;
} | {
    type: GameStateActionTypes.SET_CURRENT_PLAYER_ID;
    payload: string;
} | {
    type: GameStateActionTypes.SET_PLAYER_LIST;
    payload: string[];
} | {
    type: GameStateActionTypes.SET_OBJECT_PATH;
    payload: {
        objectId: string;
        path: CoordPair[];
    };
} | {
    type: GameStateActionTypes.POP_OBJECT_PATH;
    payload: string;
};
