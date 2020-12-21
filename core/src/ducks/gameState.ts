import { Reducer } from "redux";
import { StampedInput, CoordPair, Directions } from "../Types";
import { GameState, GameStateActionTypes, GameStateAction, GameStore } from "../Types/ReduxTypes";
import { ObjectDict, ObjectStatus } from "../Types/GameState";
import { BFS } from "../Utils/Pathfinding";
import { SPEED_FACTOR, UPDATE_FREQUENCY } from "../Game";
import { moveObjectAlongPath } from "../Game/playerUpdater";

const initialState: GameState = {
    objectStatusDict: {},
    playerList: [],
    objectPathDict: {}
};

export const gameStateReducer: Reducer<GameState, GameStateAction> = (state: GameState = initialState, action: GameStateAction) => {
    const draft = { ...state };
    switch (action.type) {
        case GameStateActionTypes.SET_OBJECT_STATUSES:
            draft.objectStatusDict = action.payload;
            break;
        case GameStateActionTypes.SET_OBJECT_STATUS:
            draft.objectStatusDict[action.payload.playerId] = action.payload.status;
            break;
        case GameStateActionTypes.ADD_PLAYER:
            if (!state.playerList.some(p => p === action.payload)) {
                draft.playerList = [...draft.playerList, action.payload];
                draft.objectStatusDict[action.payload] = { location: { x: 0, y: 0 }, direction: Directions.NONE };
            }
            break;
        case GameStateActionTypes.REMOVE_PLAYER:
            delete draft.objectStatusDict[action.payload];
            draft.playerList = draft.playerList.filter(p => p != action.payload);
            break;
        case GameStateActionTypes.SET_CURRENT_PLAYER_ID:
            draft.currentPlayer = action.payload;
            break;
        case GameStateActionTypes.SET_PLAYER_LIST:
            draft.playerList = action.payload;
            break;
        case GameStateActionTypes.SET_OBJECT_PATH:
            draft.objectPathDict[action.payload.objectId] = action.payload.path;
            break;
        case GameStateActionTypes.POP_OBJECT_PATH:
            draft.objectPathDict[action.payload] = draft.objectPathDict[action.payload].slice(1);
            break;
    }
    return draft;
};

export const setPlayerStatus = (store: GameStore, objectStatusDict: ObjectDict<ObjectStatus>) =>
    store.dispatch({ type: GameStateActionTypes.SET_OBJECT_STATUSES, payload: objectStatusDict });

export const updatePlayerStatus = (store: GameStore, playerId: string, newStatus: ObjectStatus) => 
    store.dispatch({ type: GameStateActionTypes.SET_OBJECT_STATUS, payload: { playerId, status: newStatus } });

export const addPlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.ADD_PLAYER, payload: playerId });

export const removePlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.REMOVE_PLAYER, payload: playerId });

export const setCurrentPlayers = (store: GameStore, currentPlayerId: string, fullPlayerList: string[]) => {
    store.dispatch({ type: GameStateActionTypes.SET_CURRENT_PLAYER_ID, payload: currentPlayerId });
    store.dispatch({ type: GameStateActionTypes.SET_PLAYER_LIST, payload: fullPlayerList });
};

export const setObjectPath = (store: GameStore, objectId: string, path: CoordPair[]) =>
    store.dispatch({ type: GameStateActionTypes.SET_OBJECT_PATH, payload: { objectId, path } });
    
export const popPlayerPath = (store: GameStore, playerId: string) => {
    store.dispatch({ type: GameStateActionTypes.POP_OBJECT_PATH, payload: playerId });
}

export const handlePlayerInput = (store: GameStore, playerId: string, stampedInput: StampedInput) => {
    const playerStatus = store.getState().objectStatusDict[playerId];
    if (playerStatus) {
        const path = BFS(stampedInput.input.currentLocation, stampedInput.input.destination);
        const frameDiff = ((new Date).getTime() - stampedInput.time) * UPDATE_FREQUENCY;
        const distTravelled = SPEED_FACTOR * frameDiff;
        console.log(frameDiff, distTravelled, UPDATE_FREQUENCY);
        const newStatus = moveObjectAlongPath(distTravelled, path, { ...playerStatus, location: stampedInput.input.currentLocation }, () => popPlayerPath(store, playerId));
        updatePlayerStatus(store, playerId, newStatus);
        setObjectPath(store, playerId, path);
    }
}

export const handleStateCorrection = (store: GameStore, payload: { soft: ObjectDict<CoordPair>, hard: ObjectDict<ObjectStatus> }) => {
    const { hard, soft } = payload;
    store.getState().playerList.forEach(pId => {
        const newState = hard[pId] ?? { ...store.getState().objectStatusDict[pId], location: soft[pId] ?? store.getState().objectStatusDict[pId].location };
        updatePlayerStatus(store, pId, newState);
    })
}
