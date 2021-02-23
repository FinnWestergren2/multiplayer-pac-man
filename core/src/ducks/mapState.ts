import { Reducer } from "redux";
import { Direction, MapResponse } from "..";
import { MapState, MapStateAction, MapStateActionTypes, AppDimensions, ReduxStore } from "../types/redux";

const initialState: MapState = {
    mapCells: [],
    cellModifiers: [],
    appDimensions: {
        canvasHeight: 0,
        canvasWidth: 0
    },
    cellDimensions: {
        cellSize: 0,
        oneOverCellSize: 0
    }
};

export const mapStateReducer: Reducer<MapState, MapStateAction>  = (state: MapState = initialState, action: MapStateAction) => {
    switch (action.type) {
        case MapStateActionTypes.REFRESH_MAP:
            return { ...state, mapCells: action.payload.cells, cellModifiers: action.payload.cellModifiers };
        case MapStateActionTypes.UPDATE_APP_DIMENSIONS:
            return { ...state, appDimensions: action.payload };
        case MapStateActionTypes.UPDATE_CELL_DIMENSIONS:
            return { ...state, cellDimensions: action.payload };
        default:
            return state;
    }
};

export const refreshMap = (store: ReduxStore, mapResponse: MapResponse) => {
    store.dispatch({ type: MapStateActionTypes.REFRESH_MAP, payload: mapResponse });
    store.dispatch({ type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(mapResponse.cells, store.getState().mapState.appDimensions) });
};

export const updateAppDimensions = (store: ReduxStore, width: number, height: number) => {
    store.dispatch({ type: MapStateActionTypes.UPDATE_APP_DIMENSIONS, payload: { canvasHeight: height, canvasWidth: width } });
    if (store.getState().mapState.mapCells.length > 0) {
        store.dispatch({ type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(store.getState().mapState.mapCells, { canvasHeight: height, canvasWidth: width }) });
    }
};

const generateCellDimensions = (data: Direction[][], appDimensions: AppDimensions) => {
    const size = Math.min(
        (appDimensions.canvasWidth - 1) / Math.max(...(data.map(r => r.length))),
        (appDimensions.canvasHeight - 1) / data.length);
        const oneOver =  size !== 0 ? 1 / size : 0;

    return {
        cellSize: size,
        oneOverCellSize: oneOver
    };
};
