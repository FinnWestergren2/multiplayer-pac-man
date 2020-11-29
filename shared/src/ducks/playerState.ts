import { AnyAction, Dispatch, Reducer } from "redux";
import { PlayerStatusMap, PlayerStatus } from "..";
import { StampedInput, CoordPair, CoordPairUtils, Directions } from "../Types";
import { PlayerState, PlayerStateActionTypes, PlayerStateAction, PlayerStore } from "../Types/ReduxTypes";
import { BFS } from "../Utils/Pathfinding";

const initialState: PlayerState = {
    playerStatusMap: {},
    playerList: [],
    playerPaths: {}
};

export const playerStateReducer: Reducer<PlayerState, PlayerStateAction> = (state: PlayerState = initialState, action: PlayerStateAction) => {
    switch (action.type) {
        case PlayerStateActionTypes.SET_PLAYER_STATUS:
            return { ...state, playerStatusMap: action.payload };
        case PlayerStateActionTypes.UPDATE_PLAYER_STATUS:
            return { ...state, playerStatusMap: { ...state.playerStatusMap, [action.payload.playerId]: action.payload.status } };
        case PlayerStateActionTypes.ADD_PLAYER:
            if (state.playerList.some(p => p === action.payload)) {
                return state;
            }
            const playerStatusMap = state.playerStatusMap;
            playerStatusMap[action.payload] = { location: {x: 0, y:0}, direction: Directions.NONE }
            return { ...state, playerList: [...state.playerList, action.payload], playerStatusMap };
        case PlayerStateActionTypes.REMOVE_PLAYER:
            const newState = { ...state };
            delete newState.playerStatusMap[action.payload];
            return { ...newState, playerList: state.playerList.filter(p => p != action.payload) };
        case PlayerStateActionTypes.SET_CURRENT_PLAYER_ID:
            return { ...state, currentPlayer: action.payload };
        case PlayerStateActionTypes.SET_PLAYER_LIST:
            return { ...state, playerList: action.payload };
        case PlayerStateActionTypes.UPDATE_PLAYER_STATUSES:
            return { ...state, playerStatusMap: {...state.playerStatusMap, ...action.payload } };
        case PlayerStateActionTypes.SET_PLAYER_PATH:
            return { ...state, playerPaths: { ...state.playerPaths, [action.payload.playerId]: action.payload.path }};
        case PlayerStateActionTypes.POP_PLAYER_PATH:
            if (state.playerPaths[action.payload].length >= 1) {
                return { ...state, playerPaths: { ...state.playerPaths, [action.payload]: state.playerPaths[action.payload].slice(1) }};
            }
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

export const updatePlayerStatuses = (playerStatusMap: PlayerStatusMap) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: PlayerStateActionTypes.UPDATE_PLAYER_STATUSES, payload: playerStatusMap });
    };
};

export const updatePlayerPath = (store: PlayerStore, playerId: string, path: CoordPair[]) => {
    store.dispatch({ type: PlayerStateActionTypes.SET_PLAYER_PATH, payload: {playerId, path} });
}

export const popPlayerPath = (store: PlayerStore, playerId: string) => {
    store.dispatch({ type: PlayerStateActionTypes.POP_PLAYER_PATH, payload: playerId });
}

export const handlePlayerInput = (store: PlayerStore, playerId: string, stampedInput: StampedInput ) => {
    const status = store.getState().playerStatusMap[playerId];
    if (status) {
        updatePlayerPath(store, playerId, BFS(status.location, stampedInput.input.destination));
    }
}
