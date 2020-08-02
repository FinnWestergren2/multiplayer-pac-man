import { AnyAction, Dispatch } from "redux";
import { Directions, MapResponse } from "..";
declare enum ActionTypes {
    REFRESH_MAP = "REFRESH_MAP",
    UPDATE_APP_DIMENSIONS = "UPDATE_APP_DIMENSIONS",
    UPDATE_CELL_DIMENSIONS = "UPDATE_CELL_DIMENSIONS"
}
export declare type AppDimensions = {
    canvasHeight: number;
    canvasWidth: number;
};
export declare type CellDimensions = {
    cellSize: number;
    halfCellSize: number;
};
declare type Action = {
    type: ActionTypes.REFRESH_MAP;
    payload: Directions[][];
} | {
    type: ActionTypes.UPDATE_APP_DIMENSIONS;
    payload: AppDimensions;
} | {
    type: ActionTypes.UPDATE_CELL_DIMENSIONS;
    payload: CellDimensions;
};
declare type mapState = {
    mapCells: Directions[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
};
export declare const mapStateReducer: (state: mapState | undefined, action: Action) => mapState;
export declare const refreshMap: (mapResponse: MapResponse) => (dispatch: Dispatch<AnyAction>, getState: () => mapState) => void;
export declare const updateAppDimensions: (width: number, height: number) => (dispatch: Dispatch<AnyAction>) => void;
export {};
