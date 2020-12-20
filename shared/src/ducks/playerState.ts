import { AnyAction, Dispatch, Reducer } from "redux";
import { StampedInput, CoordPair, CoordPairUtils, Directions, DirectionsUtils } from "../Types";
import { PlayerState, PlayerStateActionTypes, PlayerStateAction, PlayerStore } from "../Types/ReduxTypes";
import { PlayerLocationMap, PlayerStatus, PlayerStatusMap } from "../Types/PlayerStatus";
import { BFS } from "../Utils/Pathfinding";
import { SPEED_FACTOR, UPDATE_FREQUENCY } from "../Game";
import { movePlayerAlongPath } from "../Game/playerUpdater";

const initialState: PlayerState = {
    playerStatusMap: {},
    playerList: []
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
            playerStatusMap[action.payload] = { location: { x: 0, y: 0 }, direction: Directions.NONE, path: [] }
            return { ...state, playerList: [...state.playerList, action.payload], playerStatusMap };
        case PlayerStateActionTypes.REMOVE_PLAYER:
            const newState = { ...state };
            delete newState.playerStatusMap[action.payload];
            return { ...newState, playerList: state.playerList.filter(p => p != action.payload) };
        case PlayerStateActionTypes.SET_CURRENT_PLAYER_ID:
            return { ...state, currentPlayer: action.payload };
        case PlayerStateActionTypes.SET_PLAYER_LIST:
            return { ...state, playerList: action.payload };
        case PlayerStateActionTypes.SET_PLAYER_PATH: {
            const newStatusMap = { ...state.playerStatusMap, [action.payload.playerId]: { ...state.playerStatusMap[action.payload.playerId], path: action.payload.path } };
            return { ...state, playerStatusMap: newStatusMap };
        }
        case PlayerStateActionTypes.POP_PLAYER_PATH:
            const newStatusMap = {
                ...state.playerStatusMap, [action.payload]:
                    { ...state.playerStatusMap[action.payload], path: state.playerStatusMap[action.payload].path.slice(1) }
            };
            return { ...state, playerStatusMap: newStatusMap };
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

export const updatePlayerPath = (store: PlayerStore, playerId: string, path: CoordPair[]) => {
    store.dispatch({ type: PlayerStateActionTypes.SET_PLAYER_PATH, payload: { playerId, path } });
}

export const popPlayerPath = (store: PlayerStore, playerId: string) => {
    store.dispatch({ type: PlayerStateActionTypes.POP_PLAYER_PATH, payload: playerId });
}

export const handlePlayerInput = (store: PlayerStore, playerId: string, stampedInput: StampedInput) => {
    let playerStatus = store.getState().playerStatusMap[playerId];
    if (playerStatus) {
        const frameDiff = ((new Date).getTime() - stampedInput.time) * UPDATE_FREQUENCY;
        const distTravelled = SPEED_FACTOR * frameDiff;
        playerStatus.location = stampedInput.input.currentLocation;
        playerStatus.path = BFS(stampedInput.input.currentLocation, stampedInput.input.destination);
        movePlayerAlongPath(playerId, playerStatus, distTravelled, store);
    }
}

export const handleStateCorrection = (store: PlayerStore, payload: { soft: PlayerLocationMap, hard: PlayerStatusMap }) => {
    const { hard, soft } = payload;
    store.getState().playerList.forEach(pId => {
        const newState = hard[pId] ?? { ...store.getState().playerStatusMap[pId], location: soft[pId] ?? store.getState().playerStatusMap[pId].location };
        // @ts-ignore
        store.dispatch(updatePlayerStatus(pId, newState));
    })
}
