import { Directions, MapResponse } from "..";
import { MapState, MapStateAction, MapStateActionTypes, AppDimensions, MapStore } from "../type/ReduxTypes";

const initialState: MapState = {
    mapCells: [],
    appDimensions: {
        canvasHeight: 0,
        canvasWidth: 0
    },
    cellDimensions: {
        cellSize: 0,
        halfCellSize: 0
    }
};

export const mapStateReducer = (state: MapState = initialState, action: MapStateAction) => {
    switch (action.type) {
        case MapStateActionTypes.REFRESH_MAP:
            return { ...state, mapCells: action.payload };
        case MapStateActionTypes.UPDATE_APP_DIMENSIONS:
            return { ...state, appDimensions: action.payload };
        case MapStateActionTypes.UPDATE_CELL_DIMENSIONS:
            return { ...state, cellDimensions: action.payload };
        default:
            return state;
    }
};

export const refreshMap = (store: MapStore, mapResponse: MapResponse) => {
    store.dispatch({ type: MapStateActionTypes.REFRESH_MAP, payload: mapResponse });
    store.dispatch({ type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(mapResponse, store.getState().appDimensions) });
};

export const updateAppDimensions = (store: MapStore, width: number, height: number) => {
    store.dispatch({ type: MapStateActionTypes.UPDATE_APP_DIMENSIONS, payload: { canvasHeight: height, canvasWidth: width } });
    if (store.getState().mapCells.length > 0) {
        store.dispatch({ type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(store.getState().mapCells, { canvasHeight: height, canvasWidth: width }) });
    }
};

const generateCellDimensions = (data: Directions[][], appDimensions: AppDimensions) => {

    const size = Math.min(
        (appDimensions.canvasWidth - 1) / Math.max(...(data.map(r => r.length))),
        (appDimensions.canvasHeight - 1) / data.length);

    return {
        cellSize: size,
        halfCellSize: size * 0.5
    };
};
