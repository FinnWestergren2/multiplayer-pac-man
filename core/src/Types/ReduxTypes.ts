import { Store } from "redux";
import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
import { ObjectDict as Dictionary, ObjectStatus as ObjectStatus, StampedInput } from "./GameState";

export type MapStore = Store<MapState, MapStateAction>;
export type PlayerStore = Store<GameState, PlayerStateAction>;

export type MapState = {
    mapCells: Directions[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
}

export enum MapStateActionTypes {
    REFRESH_MAP = "REFRESH_MAP",
    UPDATE_APP_DIMENSIONS = "UPDATE_APP_DIMENSIONS",
    UPDATE_CELL_DIMENSIONS = "UPDATE_CELL_DIMENSIONS"
}

export type AppDimensions = {
    canvasHeight: number;
    canvasWidth: number;
}

export type CellDimensions = {
    cellSize: number;
    halfCellSize: number;
}

export type MapStateAction =
    { type: MapStateActionTypes.REFRESH_MAP; payload: Directions[][] } |
    { type: MapStateActionTypes.UPDATE_APP_DIMENSIONS; payload: AppDimensions } |
    { type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS; payload: CellDimensions }

export type GameState = {
    objectStatusDict: Dictionary<ObjectStatus>;
    playerList: string[];
    currentPlayer?: string;
    objectDestinationDict: Dictionary<CoordPair | undefined>;
};

export enum PlayerStateActionTypes {
    SET_OBJECT_STATUS = "SET_OBJECT_STATUS",
    SET_OBJECT_STATUSES = "SET_OBJECT_STATUSES",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID",
    SET_PLAYER_LIST = "SET_PLAYER_LIST",
    SOFT_SET_OBJECT_STATUSES = "SOFT_SET_OBJECT_STATUSES",
    RESOLVE_SOFT_UPDATE = "RESOLVE_SOFT_UPDATE",
    SET_OBJECT_DESTINATION = "SET_OBJECT_DESTINATION"
};

export type PlayerStateAction =
    { type: PlayerStateActionTypes.SET_OBJECT_STATUS; payload: { playerId: string, status: ObjectStatus } } |
    { type: PlayerStateActionTypes.SOFT_SET_OBJECT_STATUSES; payload: Dictionary<ObjectStatus> } |
    { type: PlayerStateActionTypes.RESOLVE_SOFT_UPDATE; payload: string } |
    { type: PlayerStateActionTypes.SET_OBJECT_STATUSES; payload: Dictionary<ObjectStatus> } |
    { type: PlayerStateActionTypes.ADD_PLAYER_INPUT; payload: { playerId: string, input: StampedInput } } |
    { type: PlayerStateActionTypes.ADD_PLAYER; payload: string } |
    { type: PlayerStateActionTypes.REMOVE_PLAYER; payload: string } |
    { type: PlayerStateActionTypes.SET_CURRENT_PLAYER_ID; payload: string } |
    { type: PlayerStateActionTypes.SET_PLAYER_LIST; payload: string[] } | 
    { type: PlayerStateActionTypes.SET_OBJECT_DESTINATION; payload: { playerId: string, dest: CoordPair } } 
    
