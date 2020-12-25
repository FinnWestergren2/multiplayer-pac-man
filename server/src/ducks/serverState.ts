import { Reducer, Store } from "redux";

enum ServerStateActionTypes {
    SET_SIMULATED_LAG = "SET_SIMULATED_LAG"
};

type ServerState = {
    simulatedLag: number;
};

type ServerStateAction = { type: ServerStateActionTypes.SET_SIMULATED_LAG; payload: number };

const initialState: ServerState = {
    simulatedLag: 0
};

export const serverStateReducer: Reducer<ServerState, ServerStateAction> = (state = initialState, action) => {
    const draft = { ...state };
    switch (action.type) {
        case ServerStateActionTypes.SET_SIMULATED_LAG:
        draft.simulatedLag = action.payload;
        break;
    }
    return draft;
};

export const setSimulatedLag = (store: Store<ServerState, ServerStateAction>, lag: number) => {
    store.dispatch({ type: ServerStateActionTypes.SET_SIMULATED_LAG, payload: lag });
}