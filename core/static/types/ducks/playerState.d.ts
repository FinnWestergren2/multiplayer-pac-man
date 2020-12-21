import { Reducer } from "redux";
import { StampedInput, CoordPair } from "../Types";
import { GameState, GameStateAction, PlayerStore } from "../Types/ReduxTypes";
import { ObjectDict, ObjectStatus } from "../Types/GameState";
export declare const playerStateReducer: Reducer<GameState, GameStateAction>;
export declare const setPlayerStatus: (objectStatusDict: ObjectDict<ObjectStatus>) => (dispatch: (action: GameStateAction) => void) => void;
export declare const updatePlayerStatus: (playerId: string, newStatus: ObjectStatus) => (dispatch: (action: GameStateAction) => void) => void;
export declare const addPlayer: (playerId: string) => (dispatch: (action: GameStateAction) => void) => void;
export declare const removePlayer: (playerId: string) => (dispatch: (action: GameStateAction) => void) => void;
export declare const setCurrentPlayers: (currentPlayerId: string, fullPlayerList: string[]) => (dispatch: (action: GameStateAction) => void) => void;
export declare const handlePlayerInput: (store: PlayerStore, playerId: string, stampedInput: StampedInput) => void;
export declare const handleStateCorrection: (store: PlayerStore, payload: {
    soft: ObjectDict<CoordPair>;
    hard: ObjectDict<ObjectStatus>;
}) => void;
export declare const popPlayerPath: (store: PlayerStore, playerId: string) => void;
