// This store is concerned with anything that may change due to player input.

import { PlayerCoordMap, PlayerDirectionMap } from "./sharedTypes";

enum ActionTypes {
    RECORD_CURRENT_PLAYER_LOCATIONS = "RECORD_CURRENT_PLAYER_LOCATIONS",
    RECORD_CURRENT_PLAYER_DIRECTIONS = "RECORD_CURRENT_PLAYER_DIRECTIONS",
    RECORD_CURRENT_PLAYER_QUEUED_DIRECTIONS = "RECORD_CURRENT_PLAYER_QUEUED_DIRECTIONS",
}

type Action =
    { type: ActionTypes.RECORD_CURRENT_PLAYER_LOCATIONS; payload: { playerLocations: PlayerCoordMap, frame: number } } |
    { type: ActionTypes.RECORD_CURRENT_PLAYER_DIRECTIONS; payload: { playerDirections: PlayerDirectionMap, frame: number } } | 
    { type: ActionTypes.RECORD_CURRENT_PLAYER_QUEUED_DIRECTIONS; payload: { playerDirections: PlayerDirectionMap, frame: number } } 

type framedState<T> = {
    [frame: number]: T
} 

type gameState = {
    playerLocations: framedState<PlayerCoordMap>;
    playerDirections: framedState<PlayerDirectionMap>;
    playerQueuedDirections: framedState<PlayerDirectionMap>;
}

const initialState: gameState = {
    playerLocations: {},
    playerDirections: {},
    playerQueuedDirections: {}
};

export default (state: gameState = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.RECORD_CURRENT_PLAYER_LOCATIONS:
            return { ...state, playerLocations: { ...state.playerLocations, [action.payload.frame]: action.payload.playerLocations } };
        case ActionTypes.RECORD_CURRENT_PLAYER_DIRECTIONS:
            return { ...state, playerDirections: { ...state.playerDirections, [action.payload.frame]: action.payload.playerDirections } };
        case ActionTypes.RECORD_CURRENT_PLAYER_QUEUED_DIRECTIONS:
            return { ...state, playerQueuedDirections: { ...state.playerDirections, [action.payload.frame]: action.payload.playerDirections } };
        default:
            return state;
    }
};


