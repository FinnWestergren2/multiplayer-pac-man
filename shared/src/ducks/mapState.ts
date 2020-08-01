import { AnyAction, Dispatch } from "redux";
import { Directions, MapResponse, PlayerStatusMap, PlayerStatus } from "..";

enum ActionTypes {
    REFRESH_MAP = "REFRESH_MAP",
    UPDATE_APP_DIMENSIONS = "UPDATE_APP_DIMENSIONS",
    UPDATE_CELL_DIMENSIONS = "UPDATE_CELL_DIMENSIONS",
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS"
}

export type AppDimensions = {
    canvasHeight: number;
    canvasWidth: number;
}

export type CellDimensions = {
    cellSize: number;
    halfCellSize: number;
}

type Action =
    { type: ActionTypes.REFRESH_MAP; payload: Directions[][] } |
    { type: ActionTypes.UPDATE_APP_DIMENSIONS; payload: AppDimensions } |
    { type: ActionTypes.UPDATE_CELL_DIMENSIONS; payload: CellDimensions } |
    { type: ActionTypes.UPDATE_PLAYER_STATUS; payload: { playerId: string, status: PlayerStatus } }

type mapState = {
    mapCells: Directions[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
    playerStatusMap: PlayerStatusMap;
}

const initialState: mapState = {
    mapCells: [],
    appDimensions: {
        canvasHeight: 0,
        canvasWidth: 0
    },
    cellDimensions: {
        cellSize: 0,
        halfCellSize: 0
    },
    playerStatusMap: {}
};

export const mapStateReducer = (state: mapState = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.REFRESH_MAP:
            return { ...state, mapCells: action.payload };
        case ActionTypes.UPDATE_APP_DIMENSIONS:
            return { ...state, appDimensions: action.payload };
        case ActionTypes.UPDATE_CELL_DIMENSIONS:
            return { ...state, cellDimensions: action.payload };
        case ActionTypes.UPDATE_PLAYER_STATUS:
            return { ...state, playerStatusMap: { ...state.playerStatusMap, [action.payload.playerId]: action.payload.status } };
        default:
            return state;
    }
};

export const refreshMap = (mapResponse: MapResponse) => {
    return function (dispatch: Dispatch<AnyAction>, getState: () => mapState) {
        dispatch({ type: ActionTypes.REFRESH_MAP, payload: mapResponse });
        dispatch({ type: ActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(mapResponse, getState().appDimensions) });
    };
};

export const updateAppDimensions = (width: number, height: number) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.UPDATE_APP_DIMENSIONS, payload: { canvasHeight: height, canvasWidth: width } });
    };
};

export const updatePlayerStatus = (playerId: string, newStatus: PlayerStatus) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: ActionTypes.UPDATE_PLAYER_STATUS, payload: { playerId, status: newStatus } });
    };
}

const generateCellDimensions = (data: Directions[][], appDimensions: AppDimensions) => {
    const size = Math.min(
        (appDimensions.canvasWidth - 1) / Math.max(...(data.map(r => r.length))),
        (appDimensions.canvasHeight - 1) / data.length);

    return {
        cellSize: size,
        halfCellSize: size * 0.5
    };
};