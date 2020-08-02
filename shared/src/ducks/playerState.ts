import { AnyAction, Dispatch } from "redux";
import { PlayerStatusMap, PlayerStatus, PlayerInputHistory } from "..";
import { StampedInput } from "../GameObject";

enum ActionTypes {
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
    ADD_PLAYER_INPUT = "ADD_PLAYER_INPUT",
    ADD_PLAYER = "ADD_PLAYER",
    REMOVE_PLAYER = "REMOVE_PLAYER",
    SET_CURRENT_PLAYER_ID = "SET_CURRENT_PLAYER_ID"
};

type Action =
    { type: ActionTypes.UPDATE_PLAYER_STATUS; payload: { playerId: string, status: PlayerStatus } } |
    { type: ActionTypes.ADD_PLAYER_INPUT; payload: { playerId: string, input: StampedInput } } |
    { type: ActionTypes.ADD_PLAYER; payload: string } |
    { type: ActionTypes.REMOVE_PLAYER; payload: string } |
    { type: ActionTypes.SET_CURRENT_PLAYER_ID; payload: string }



type State = {
    playerStatusMap: PlayerStatusMap;
    playerInputHistory: PlayerInputHistory;
    playerList: string[];
    currentPlayer?: string;
};

const initialState: State = {
    playerStatusMap: {},
    playerInputHistory: {},
    playerList: []
};

export const playerStateReducer = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_PLAYER_STATUS:
            return { ...state, playerStatusMap: { ...state.playerStatusMap, [action.payload.playerId]: action.payload.status } };
        case ActionTypes.ADD_PLAYER_INPUT:
            const newHistory = state.playerInputHistory[action.payload.playerId] 
                ? [...state.playerInputHistory[action.payload.playerId], action.payload.input] 
                : [action.payload.input];
            return { ...state, playerInputHistory: { ...state.playerInputHistory, [action.payload.playerId]: newHistory } };
        case ActionTypes.ADD_PLAYER:
            if (state.playerList.some(p => p === action.payload)) {
                return state;
            }
            return { ...state, playerList: [...state.playerList, action.payload] };
        case ActionTypes.REMOVE_PLAYER:
            return { ...state, playerList: state.playerList.filter(p => p != action.payload) };
        case ActionTypes.SET_CURRENT_PLAYER_ID:
            return { ...state, currentPlayer: action.payload };
        default:
            return state;
    }
};

export const updatePlayerStatus = (playerId: string, newStatus: PlayerStatus) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.UPDATE_PLAYER_STATUS, payload: { playerId, status: newStatus } });
    };
};

export const addPlayerInput = (playerId: string, input: StampedInput) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.ADD_PLAYER_INPUT, payload: { playerId, input } });
    };
};

export const addPlayer = (playerId: string) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.ADD_PLAYER, payload: playerId });
    };
};

export const removePlayer = (playerId: string) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.REMOVE_PLAYER, payload: playerId });
    };
};

export const setCurrentPlayer = (playerId: string) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.SET_CURRENT_PLAYER_ID, payload: playerId });
    };
};