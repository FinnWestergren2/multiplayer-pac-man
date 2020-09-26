import { AnyAction, Dispatch, Reducer } from "redux";
import { PlayerStatusMap, PlayerStatus, PlayerInputHistory } from "..";
import { StampedInput } from "../Types";
import { PlayerState, PlayerStateActionTypes, PlayerStateAction } from "../Types/ReduxTypes";

const initialState: PlayerState = {
    playerStatusMap: {},
    playerInputHistory: {},
    playerList: [],
    mostRecentInput: null,
    lastOverrideTime: 0
};

export const playerStateReducer: Reducer<PlayerState,PlayerStateAction> = (state: PlayerState = initialState, action: PlayerStateAction) => {
    switch (action.type) {
        case PlayerStateActionTypes.SET_PLAYER_STATUS:
            return { ...state, playerStatusMap: action.payload, lastOverrideTime: (new Date()).getTime() };
        case PlayerStateActionTypes.UPDATE_PLAYER_STATUS:
            return { ...state, playerStatusMap: { ...state.playerStatusMap, [action.payload.playerId]: action.payload.status } };
        case PlayerStateActionTypes.ADD_PLAYER_INPUT:
            const newHistory = state.playerInputHistory[action.payload.playerId]
                ? [...state.playerInputHistory[action.payload.playerId], action.payload.input]
                : [action.payload.input];
            return { ...state, playerInputHistory: { ...state.playerInputHistory, [action.payload.playerId]: newHistory }, mostRecentInput: action.payload };
        case PlayerStateActionTypes.ADD_PLAYER:
            if (state.playerList.some(p => p === action.payload)) {
                return state;
            }
            return { ...state, playerList: [...state.playerList, action.payload] };
        case PlayerStateActionTypes.REMOVE_PLAYER:
            const newState = { ...state };
            delete newState.playerStatusMap[action.payload];
            delete newState.playerInputHistory[action.payload];
            return { ...newState, playerList: state.playerList.filter(p => p != action.payload) };
        case PlayerStateActionTypes.SET_CURRENT_PLAYER_ID:
            return { ...state, currentPlayer: action.payload };
        case PlayerStateActionTypes.SET_PLAYER_LIST:
            return { ...state, playerList: action.payload };
        default:
            return state;
    }
};

export const setPlayerStatus = (playerStatusMap: PlayerStatusMap) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.SET_PLAYER_STATUS, payload: playerStatusMap });
    };
};

export const updatePlayerStatus = (playerId: string, newStatus: PlayerStatus) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.UPDATE_PLAYER_STATUS, payload: { playerId, status: newStatus } });
    };
};

export const addPlayerInput = (playerId: string, input: StampedInput) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.ADD_PLAYER_INPUT, payload: { playerId, input } });
    };
};

export const addPlayer = (playerId: string) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.ADD_PLAYER, payload: playerId });
    };
};

export const removePlayer = (playerId: string) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.REMOVE_PLAYER, payload: playerId });
    };
};

export const setCurrentPlayers = (currentPlayerId: string, fullPlayerList: string[]) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.SET_CURRENT_PLAYER_ID, payload: currentPlayerId });
        dispatch({ type: PlayerStateActionTypes.SET_PLAYER_LIST, payload: fullPlayerList });
    };
};
