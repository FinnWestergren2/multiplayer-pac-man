import { Reducer } from "redux";
import { StampedInput, CoordPair } from "../Types";
import { GameState, PlayerStateActionTypes, PlayerStateAction, PlayerStore } from "../Types/ReduxTypes";
import { ObjectDict, ObjectStatus } from "../Types/GameState";
export declare const playerStateReducer: Reducer<GameState, PlayerStateAction>;
export declare const setPlayerStatus: (objectStatusDict: ObjectDict<ObjectStatus>) => (dispatch: (arg0: {
    type: PlayerStateActionTypes;
    payload: ObjectDict<ObjectStatus>;
}) => void) => void;
export declare const updatePlayerStatus: (playerId: string, newStatus: ObjectStatus) => (dispatch: (action: PlayerStateAction) => void) => void;
export declare const addPlayer: (playerId: string) => (dispatch: (arg0: {
    type: PlayerStateActionTypes;
    payload: string;
}) => void) => void;
export declare const removePlayer: (playerId: string) => (dispatch: (arg0: {
    type: PlayerStateActionTypes;
    payload: string;
}) => void) => void;
export declare const setCurrentPlayers: (currentPlayerId: string, fullPlayerList: string[]) => (dispatch: (arg0: {
    type: PlayerStateActionTypes;
    payload: string | string[];
}) => void) => void;
export declare const handlePlayerInput: (store: PlayerStore, playerId: string, stampedInput: StampedInput) => void;
export declare const handleStateCorrection: (store: PlayerStore, payload: {
    soft: ObjectDict<CoordPair>;
    hard: ObjectDict<ObjectStatus>;
}) => void;
