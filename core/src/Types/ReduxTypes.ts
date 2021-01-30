import { Store } from "redux";
import { CoordPair } from "./CoordPair";
import { Directions } from "./Directions";
import { Actor, Dictionary, ActorStatus as ActorStatus, ActorType, StampedInput } from "./GameState";

export type MapStore = Store<MapState, MapStateAction>;
export type GameStore = Store<GameState, GameStateAction>;

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
    currentPlayer?: string;
    actorPathDict: Dictionary<CoordPair[]>;
    actorDict: Dictionary<Actor>;
    actorOwnershipDict: Dictionary<string[]>;
    playerList: string[];
};

export enum GameStateActionTypes {
    SET_ACTOR_STATUS = "SET_ACTOR_STATUS",
    SET_ACTORS = "SET_ACTORS",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    ADD_ACTOR = "ADD_ACTOR",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    REMOVE_ACTOR = "REMOVE_ACTOR",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID",
    SET_PLAYER_LIST = "SET_PLAYER_LIST",
    SET_ACTOR_PATH = "SET_ACTOR_PATH",
    POP_ACTOR_PATH = "POP_ACTOR_PATH"
};

export type GameStateAction =
    { type: GameStateActionTypes.SET_ACTOR_STATUS; payload: { actorId: string, status: ActorStatus } } |
    { type: GameStateActionTypes.SET_ACTORS; payload: Dictionary<Actor> } |
    { type: GameStateActionTypes.ADD_PLAYER_INPUT; payload: { playerId: string, input: StampedInput } } |
    { type: GameStateActionTypes.ADD_PLAYER; payload: string } |
    { type: GameStateActionTypes.ADD_ACTOR; payload: { ownerId: string, actorId: string, actorType: ActorType, location: CoordPair } } |
    { type: GameStateActionTypes.REMOVE_PLAYER; payload: string } |
    { type: GameStateActionTypes.REMOVE_ACTOR; payload: string } |
    { type: GameStateActionTypes.SET_CURRENT_PLAYER_ID; payload: string } |
    { type: GameStateActionTypes.SET_PLAYER_LIST; payload: string[] } | 
    { type: GameStateActionTypes.SET_ACTOR_PATH; payload: { actorId: string, path: CoordPair[] } } |
    { type: GameStateActionTypes.POP_ACTOR_PATH; payload: string } 
    
