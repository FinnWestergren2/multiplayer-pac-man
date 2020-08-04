import { AnyAction, Dispatch } from "redux";
import { Directions, MapResponse } from "..";
import { MapState, MapStateAction, MapStateActionTypes, AppDimensions } from "../Types/ReduxTypes";

const initialState: MapState = {
    mapCells: [],
    appDimensions: {
        canvasHeight: 600,
        canvasWidth: 600
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

export const refreshMap = (mapResponse: MapResponse) => {
    return function (dispatch: Dispatch<AnyAction>, getState: () => MapState) {
        dispatch({ type: MapStateActionTypes.REFRESH_MAP, payload: mapResponse });
        dispatch({ type: MapStateActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(mapResponse, getState().appDimensions) });
    };
};

export const updateAppDimensions = (width: number, height: number) => {
    return function (dispatch: Dispatch<AnyAction>) {
        dispatch({ type: MapStateActionTypes.UPDATE_APP_DIMENSIONS, payload: { canvasHeight: height, canvasWidth: width } });
    };
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
