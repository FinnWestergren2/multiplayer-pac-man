import { AnyAction, Dispatch, Reducer } from "redux";
import { StampedInput, CoordPair } from "../Types";
import { PlayerState, PlayerStateAction, PlayerStore } from "../Types/ReduxTypes";
import { PlayerLocationMap, PlayerStatus, PlayerStatusMap } from "../Types/PlayerStatus";
export declare const playerStateReducer: Reducer<PlayerState, PlayerStateAction>;
export declare const setPlayerStatus: (playerStatusMap: PlayerStatusMap) => (dispatch: Dispatch<AnyAction>) => void;
export declare const updatePlayerStatus: (playerId: string, newStatus: PlayerStatus) => (dispatch: Dispatch<AnyAction>) => void;
export declare const addPlayer: (playerId: string) => (dispatch: Dispatch<AnyAction>) => void;
export declare const removePlayer: (playerId: string) => (dispatch: Dispatch<AnyAction>) => void;
export declare const setCurrentPlayers: (currentPlayerId: string, fullPlayerList: string[]) => (dispatch: Dispatch<AnyAction>) => void;
export declare const updatePlayerPath: (store: PlayerStore, playerId: string, path: CoordPair[]) => void;
export declare const popPlayerPath: (store: PlayerStore, playerId: string) => void;
export declare const handlePlayerInput: (store: PlayerStore, playerId: string, stampedInput: StampedInput) => void;
export declare const handleStateCorrection: (store: PlayerStore, payload: {
    soft: PlayerLocationMap;
    hard: PlayerStatusMap;
}) => void;
