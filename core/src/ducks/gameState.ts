import { Reducer } from "redux";
import { CoordPair, Directions } from "../types";
import { GameState, GameStateActionTypes, GameStateAction, GameStore } from "../types/redux";
import { ActorStatus, ActorType } from "../types/actor";

const initialState: GameState = {
    actorDict: {},
    playerList: [],
    actorPathDict: {},
    actorOwnershipDict: {}
};

export const gameStateReducer: Reducer<GameState, GameStateAction> = (state: GameState = initialState, action: GameStateAction) => {
    const draft = { ...state };
    switch (action.type) {
        case GameStateActionTypes.SET_GAME_STATE:
            return action.payload;
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
            if (draft.actorOwnershipDict[action.payload.ownerId]) {
                draft.actorOwnershipDict[action.payload.ownerId].push(action.payload.actorId);
            }
            else {
                draft.actorOwnershipDict[action.payload.ownerId] = [action.payload.actorId];
            }
            break;
        case GameStateActionTypes.REMOVE_PLAYER:
            draft.actorOwnershipDict[action.payload]?.forEach(oId => {
                delete draft.actorDict[oId];
            });
            delete draft.actorOwnershipDict[action.payload];
            draft.playerList = draft.playerList.filter(p => p != action.payload);
            break;
        case GameStateActionTypes.REMOVE_UNIT:
            const obj = draft.actorDict[action.payload];
            draft.actorOwnershipDict[obj.ownerId] = draft.actorOwnershipDict[obj.ownerId].filter(o => o != action.payload); 
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

export const setGameState = (store: GameStore, state: GameState) => 
    store.dispatch({ type: GameStateActionTypes.SET_GAME_STATE, payload: state });

export const updateActorStatus = (store: GameStore, actorId: string, newStatus: ActorStatus) => 
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_STATUS, payload: { actorId, status: newStatus } });

export const addPlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.ADD_PLAYER, payload: playerId });

export const addActor = (store: GameStore, ownerId: string, actorId: string, actorType: ActorType, location: CoordPair) => 
    store.dispatch({ type: GameStateActionTypes.ADD_ACTOR, payload: { ownerId, actorType, location, actorId }});

export const removePlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.REMOVE_PLAYER, payload: playerId });

export const setActorPath = (store: GameStore, actorId: string, path: CoordPair[]) =>
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_PATH, payload: { actorId, path } });
    
export const popActorPath = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.POP_ACTOR_PATH, payload: playerId });