// This store is concerned with anything that may change due to player input.

import { PlayerCoordMap } from "./sharedTypes";

enum ActionTypes {
    UPDATE_CURRENT_PLAYER_LOCATIONS =  "UPDATE_CURRENT_PLAYER_LOCATIONS"
}

type Action = 
    {type: ActionTypes.UPDATE_CURRENT_PLAYER_LOCATIONS; payload: PlayerCoordMap}

type gameState = {
    playerLocations: PlayerCoordMap;
}

const initialState: gameState = {
    playerLocations: {}
};

export default (state: gameState = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_CURRENT_PLAYER_LOCATIONS:
            return { ...state, playerLocations: action.payload };
        default:
            return state;
    }
};
