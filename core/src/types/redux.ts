import { Store } from "redux";
import { CoordPair } from "./coordPair";
import { Direction } from "./direction";
import { Actor, ActorStatus as ActorStatus, ActorType } from "./actor";
import { Dictionary } from ".";
import { CellModifier } from "./cellModifier";
import { MapResponse } from "../socketObject";

export type MapStore = Store<MapState, MapStateAction>;
export type GameStore = Store<GameState, GameStateAction>;

export type MapState = {
    mapCells: Direction[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
    cellModifiers: CellModifier[][];
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
    oneOverCellSize: number;
}

export type MapStateAction =
    { type: MapStateActionTypes.REFRESH_MAP; payload: MapResponse } |
    { type: MapStateActionTypes.UPDATE_APP_DIMENSIONS; payload: AppDimensions } |
    { type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS; payload: CellDimensions }

export type GameState = {
    currentPlayer?: string;
    actorPathDict: Dictionary<CoordPair[]>;
    actorDict: Dictionary<Actor>;
    actorOwnershipDict: Dictionary<string[]>;
    playerList: string[];
};

export enum GameStateActionTypes {
    SET_ACTOR_STATUS = "SET_ACTOR_STATUS",
    ADD_PLAYER = "ADD_PLAYER",
    ADD_ACTOR = "ADD_ACTOR",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    REMOVE_ACTOR = "REMOVE_ACTOR",
    SET_ACTOR_PATH = "SET_ACTOR_PATH",
    POP_ACTOR_PATH = "POP_ACTOR_PATH",
    SET_GAME_STATE = "SET_GAME_STATE"
};

export type GameStateAction =
    { type: GameStateActionTypes.SET_ACTOR_STATUS; payload: { actorId: string, status: ActorStatus } } |
    { type: GameStateActionTypes.ADD_PLAYER; payload: string } |
    { type: GameStateActionTypes.REMOVE_PLAYER; payload: string } |
    { type: GameStateActionTypes.ADD_ACTOR; payload: { ownerId: string, actorId: string, actorType: ActorType, location: CoordPair } } |
    { type: GameStateActionTypes.REMOVE_ACTOR; payload: string } |
    { type: GameStateActionTypes.SET_ACTOR_PATH; payload: { actorId: string, path: CoordPair[] } } |
    { type: GameStateActionTypes.POP_ACTOR_PATH; payload: string } |
    { type: GameStateActionTypes.SET_GAME_STATE; payload: GameState }
