import { Reducer, Store } from "redux";

enum ServerStateActionTypes {
    SET_SIMULATED_LAG = "SET_SIMULATED_LAG",
}

type ServerState = {
    simulatedLag: {[playerId: string]: number};
};

type SetSimulatedLagAction = {
    type: ServerStateActionTypes.SET_SIMULATED_LAG;
    payload: { lag: number; playerId: string };
};

type ServerStateAction = SetSimulatedLagAction;

const initialState: ServerState = {
    simulatedLag: {},
};

export const serverStateReducer: Reducer<ServerState, ServerStateAction> = (
    state = initialState,
    action
) => {
    const draft = { ...state };
    switch (action.type) {
        case ServerStateActionTypes.SET_SIMULATED_LAG:
            draft.simulatedLag[action.payload.playerId] = action.payload.lag;
            break;
    }
    return draft;
};

export const setSimulatedLag = (
    store: Store<ServerState, ServerStateAction>,
    playerId: string,
    lag: number
) => {
    store.dispatch({
        type: ServerStateActionTypes.SET_SIMULATED_LAG,
        payload: { lag, playerId },
    });
};
