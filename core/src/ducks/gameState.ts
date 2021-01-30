import { Reducer } from "redux";
import { StampedInput, CoordPair, Directions } from "../types";
import { GameState, GameStateActionTypes, GameStateAction, GameStore } from "../types/ReduxTypes";
import {  Actor, ActorStatus, ActorType, Dictionary } from "../types/GameState";
import { SPEED_FACTOR, UPDATE_FREQUENCY } from "../game";
import { moveActorAlongPath, BFS } from "../game/actorUpdater";
import { generateGuid } from "../utils/misc";

const initialState: GameState = {
    actorDict: {},
    playerList: [],
    actorPathDict: {},
    actorOwnershipDict: {}
};

export const gameStateReducer: Reducer<GameState, GameStateAction> = (state: GameState = initialState, action: GameStateAction) => {
    const draft = { ...state };
    switch (action.type) {
        case GameStateActionTypes.SET_ACTORS:
            draft.actorDict = action.payload;
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
            draft.actorOwnershipDict[action.payload]?.forEach(oId => {
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

export const setActors = (store: GameStore, actorDict: Dictionary<Actor>) =>
    store.dispatch({ type: GameStateActionTypes.SET_ACTORS, payload: actorDict });

export const updateActorStatus = (store: GameStore, actorId: string, newStatus: ActorStatus) => 
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_STATUS, payload: { actorId, status: newStatus } });

export const addPlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.ADD_PLAYER, payload: playerId });

export const addActor = (store: GameStore, ownerId: string, actorId: string, actorType: ActorType, location: CoordPair) => 
    store.dispatch({ type: GameStateActionTypes.ADD_ACTOR, payload: { ownerId, actorType, location, actorId }});

export const removePlayer = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.REMOVE_PLAYER, payload: playerId });

export const setCurrentPlayers = (store: GameStore, currentPlayerId: string, fullPlayerList: string[]) => {
    store.dispatch({ type: GameStateActionTypes.SET_CURRENT_PLAYER_ID, payload: currentPlayerId });
    store.dispatch({ type: GameStateActionTypes.SET_PLAYER_LIST, payload: fullPlayerList });
};

export const setActorPath = (store: GameStore, actorId: string, path: CoordPair[]) =>
    store.dispatch({ type: GameStateActionTypes.SET_ACTOR_PATH, payload: { actorId, path } });
    
export const popPlayerPath = (store: GameStore, playerId: string) =>
    store.dispatch({ type: GameStateActionTypes.POP_ACTOR_PATH, payload: playerId });