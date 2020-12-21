import { AnyAction, Dispatch, Reducer } from "redux";
import { StampedInput, CoordPair, Directions } from "../Types";
import { GameState, PlayerStateActionTypes, PlayerStateAction, PlayerStore } from "../Types/ReduxTypes";
import { ObjectDict, ObjectStatus } from "../Types/GameState";
import { BFS } from "../Utils/Pathfinding";
import { SPEED_FACTOR, UPDATE_FREQUENCY } from "../Game";
import { moveObjectAlongPath } from "../Game/playerUpdater";

const initialState: GameState = {
    objectStatusDict: {},
    playerList: [],
    objectDestinationDict: {}
};

export const playerStateReducer: Reducer<GameState, PlayerStateAction> = (state: GameState = initialState, action: PlayerStateAction) => {
    const draft = { ...state };
    switch (action.type) {
        case PlayerStateActionTypes.SET_OBJECT_STATUSES:
            draft.objectStatusDict = action.payload;
            break;
        case PlayerStateActionTypes.SET_OBJECT_STATUS:
            draft.objectStatusDict[action.payload.playerId] = action.payload.status;
            break;
        case PlayerStateActionTypes.ADD_PLAYER:
            if (!state.playerList.some(p => p === action.payload)) {
                draft.playerList = [...draft.playerList, action.payload];
                draft.objectStatusDict[action.payload] = { location: { x: 0, y: 0 }, direction: Directions.NONE };
            }
            break;
        case PlayerStateActionTypes.REMOVE_PLAYER:
            delete draft.objectStatusDict[action.payload];
            draft.playerList = draft.playerList.filter(p => p != action.payload);
            break;
        case PlayerStateActionTypes.SET_CURRENT_PLAYER_ID:
            draft.currentPlayer = action.payload;
            break;
        case PlayerStateActionTypes.SET_PLAYER_LIST:
            draft.playerList = action.payload;
            break;
        case PlayerStateActionTypes.SET_OBJECT_DESTINATION:
            draft.objectDestinationDict[action.payload.playerId] = action.payload.dest;
    }
    return draft;
};

export const setPlayerStatus = (objectStatusDict: ObjectDict<ObjectStatus>) => {
    return function (dispatch: (arg0: { type: PlayerStateActionTypes; payload: ObjectDict<ObjectStatus>; }) => void) {
        dispatch({ type: PlayerStateActionTypes.SET_OBJECT_STATUSES, payload: objectStatusDict });
    };
};

export const updatePlayerStatus = (playerId: string, newStatus: ObjectStatus) => {
    return function (dispatch: (action: PlayerStateAction) => void) {
        dispatch({ type: PlayerStateActionTypes.SET_OBJECT_STATUS, payload: { playerId, status: newStatus } });
    };
};

export const addPlayer = (playerId: string) => {
    return function (dispatch: (arg0: { type: PlayerStateActionTypes; payload: string; }) => void) {
        dispatch({ type: PlayerStateActionTypes.ADD_PLAYER, payload: playerId });
    };
};

export const removePlayer = (playerId: string) => {
    return function (dispatch: (arg0: { type: PlayerStateActionTypes; payload: string; }) => void) {
        dispatch({ type: PlayerStateActionTypes.REMOVE_PLAYER, payload: playerId });
    };
};

export const setCurrentPlayers = (currentPlayerId: string, fullPlayerList: string[]) => {
    return function (dispatch: (arg0: { type: PlayerStateActionTypes; payload: string | string[]; }) => void) {
        dispatch({ type: PlayerStateActionTypes.SET_CURRENT_PLAYER_ID, payload: currentPlayerId });
        dispatch({ type: PlayerStateActionTypes.SET_PLAYER_LIST, payload: fullPlayerList });
    };
};

export const handlePlayerInput = (store: PlayerStore, playerId: string, stampedInput: StampedInput) => {
    const playerStatus = store.getState().objectStatusDict[playerId];
    if (playerStatus) {
        const frameDiff = ((new Date).getTime() - stampedInput.time) * UPDATE_FREQUENCY;
        const distTravelled = SPEED_FACTOR * Math.max(frameDiff * 2, 1); // multiply by two because by the time you update, they'll be crusing along the same speed
        const path = BFS(stampedInput.input.currentLocation, stampedInput.input.destination);
        const newStatus = moveObjectAlongPath(distTravelled, path, playerStatus);
        // @ts-ignore
        store.dispatch(updatePlayerStatus(playerId, newStatus));
        store.dispatch({ type: PlayerStateActionTypes.SET_OBJECT_DESTINATION, payload: { playerId, dest: stampedInput.input.destination } });
    }
}

export const handleStateCorrection = (store: PlayerStore, payload: { soft: ObjectDict<CoordPair>, hard: ObjectDict<ObjectStatus> }) => {
    const { hard, soft } = payload;
    store.getState().playerList.forEach(pId => {
        const newState = hard[pId] ?? { ...store.getState().objectStatusDict[pId], location: soft[pId] ?? store.getState().objectStatusDict[pId].location };
        // @ts-ignore
        store.dispatch(updatePlayerStatus(pId, newState));
    })
}
