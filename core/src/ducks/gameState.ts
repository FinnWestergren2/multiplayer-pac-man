import { Reducer } from "redux";
import { StampedInput, CoordPair, Directions } from "../Types";
import { GameState, GameStateActionTypes, GameStateAction, GameStore } from "../Types/ReduxTypes";
import { ActorDict, ActorStatus, ActorType } from "../Types/GameState";
import { SPEED_FACTOR, UPDATE_FREQUENCY } from "../Game";
import { moveActorAlongPath, BFS } from "../Game/playerUpdater";
import { generateGuid } from "../Utils/Misc";

const initialState: GameState = {
    actorDict: {},
    playerList: [],
    actorPathDict: {},
    actorOwnershipDict: {}
};

export const gameStateReducer: Reducer<GameState, GameStateAction> = (state: GameState = initialState, action: GameStateAction) => {
    const draft = { ...state };
    switch (action.type) {
        case GameStateActionTypes.SET_ACTOR_STATUSES:
            Object.keys(action.payload).forEach(key => draft.actorDict[key].status = action.payload[key])
            break;
        case GameStateActionTypes.SET_ACTOR_STATUS:
            draft.actorDict[action.payload.actorId].status = action.payload.status;
            break;
        case GameStateActionTypes.ADD_PLAYER:
            if (!state.playerList.some(p => p === action.payload)) {
                draft.playerList = [...draft.playerList, action.payload];
            }
            break;
        case GameStateActionTypes.ADD_ACTOR:
            draft.actorDict[action.payload.actorId] = { 
                type: action.payload.actorType,
                ownerId: action.payload.ownerId,
                status: { location: action.payload.location, direction: Directions.NONE }
            };
            draft.actorOwnershipDict[action.payload.ownerId].push(action.payload.actorId);
            break;
        case GameStateActionTypes.REMOVE_PLAYER:
            draft.actorOwnershipDict[action.payload].forEach(oId => {
                delete draft.actorDict[oId];
            });
            delete draft.actorOwnershipDict[action.payload];
            draft.playerList = draft.playerList.filter(p => p != action.payload);
            break;
        case GameStateActionTypes.REMOVE_ACTOR:
            const obj = draft.actorDict[action.payload];
            draft.actorOwnershipDict[obj.ownerId] = draft.actorOwnershipDict[obj.ownerId].filter(o => o != action.payload); 
            break;
        case GameStateActionTypes.SET_CURRENT_PLAYER_ID:
            draft.currentPlayer = action.payload;
            break;
        case GameStateActionTypes.SET_PLAYER_LIST:
            draft.playerList = action.payload;
            break;
        case GameStateActionTypes.SET_ACTOR_PATH:
            draft.actorPathDict[action.payload.actorId] = action.payload.path;
            break;
        case GameStateActionTypes.POP_ACTOR_PATH:
            draft.actorPathDict[action.payload] = draft.actorPathDict[action.payload].slice(1);
            break;
    }
    return draft;
};

export const setActorStatus = (store: GameStore, actorStatusDict: ActorDict<ActorStatus>) =>
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_STATUSES, payload: actorStatusDict });

export const updateActorStatus = (store: GameStore, actorId: string, newStatus: ActorStatus) => 
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_STATUS, payload: { actorId, status: newStatus } });

export const addPlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.ADD_PLAYER, payload: playerId });

export const addActor = (store: GameStore, ownerId: string, actorType: ActorType, location: CoordPair) => {
    const actor = { ownerId, actorType, location, actorId: generateGuid() };
    store.dispatch({ type: GameStateActionTypes.ADD_ACTOR, payload: { ...actor }});
}

export const removePlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.REMOVE_PLAYER, payload: playerId });

export const setCurrentPlayers = (store: GameStore, currentPlayerId: string, fullPlayerList: string[]) => {
    store.dispatch({ type: GameStateActionTypes.SET_CURRENT_PLAYER_ID, payload: currentPlayerId });
    store.dispatch({ type: GameStateActionTypes.SET_PLAYER_LIST, payload: fullPlayerList });
};

export const setActorPath = (store: GameStore, actorId: string, path: CoordPair[]) =>
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_PATH, payload: { actorId, path } });
    
export const popPlayerPath = (store: GameStore, playerId: string) => {
    store.dispatch({ type: GameStateActionTypes.POP_ACTOR_PATH, payload: playerId });
}

export const handlePlayerInput = (store: GameStore, playerId: string, stampedInput: StampedInput) => {
    const playerStatus = store.getState().actorDict[playerId]?.status;
    if (playerStatus) {
        const path = BFS(stampedInput.input.currentLocation, stampedInput.input.destination);
        const frameDiff = stampedInput.timeAgo * UPDATE_FREQUENCY;
        const distTravelled = SPEED_FACTOR * frameDiff;
        console.log(frameDiff, distTravelled, UPDATE_FREQUENCY);
        const newStatus = moveActorAlongPath(distTravelled, path, { ...playerStatus, location: stampedInput.input.currentLocation }, () => popPlayerPath(store, playerId));
        updateActorStatus(store, playerId, newStatus);
        setActorPath(store, playerId, path);
    }
}

export const handleStateCorrection = (store: GameStore, payload: { soft: ActorDict<CoordPair>, hard: ActorDict<ActorStatus> }) => {
    const { hard, soft } = payload;
    store.getState().playerList.forEach(pId => {
        const newState = hard[pId] ?? { ...store.getState().actorDict[pId], location: soft[pId] ?? store.getState().actorDict[pId].status.location };
        updateActorStatus(store, pId, newState);
    })
}
