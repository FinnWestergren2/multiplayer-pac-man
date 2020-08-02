import { AnyAction, Dispatch } from "redux";
import { PlayerStatusMap, PlayerStatus, PlayerInputHistory } from "..";
import { StampedInput } from "../GameObject";
declare enum ActionTypes {
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID"
}
declare type Action = {
    type: ActionTypes.UPDATE_PLAYER_STATUS;
    payload: {
        playerId: string;
        status: PlayerStatus;
    };
} | {
    type: ActionTypes.ADD_PLAYER_INPUT;
    payload: {
        playerId: string;
        input: StampedInput;
    };
} | {
    type: ActionTypes.ADD_PLAYER;
    payload: string;
} | {
    type: ActionTypes.REMOVE_PLAYER;
    payload: string;
} | {
    type: ActionTypes.SET_CURRENT_PLAYER_ID;
    payload: string;
};
declare type State = {
    playerStatusMap: PlayerStatusMap;
    playerInputHistory: PlayerInputHistory;
    playerList: string[];
    currentPlayer?: string;
};
export declare const playerStateReducer: (state: State | undefined, action: Action) => State;
export declare const updatePlayerStatus: (playerId: string, newStatus: PlayerStatus) => (dispatch: Dispatch<AnyAction>) => void;
export declare const addPlayerInput: (playerId: string, input: StampedInput) => (dispatch: Dispatch<AnyAction>) => void;
export declare const addPlayer: (playerId: string) => (dispatch: Dispatch<AnyAction>) => void;
export declare const removePlayer: (playerId: string) => (dispatch: Dispatch<AnyAction>) => void;
export declare const setCurrentPlayer: (playerId: string) => (dispatch: Dispatch<AnyAction>) => void;
export {};
