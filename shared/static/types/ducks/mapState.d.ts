import { AnyAction, Dispatch } from "redux";
import { Directions, MapResponse, PlayerStatusMap, PlayerStatus } from "..";
declare enum ActionTypes {
    REFRESH_MAP = "REFRESH_MAP",
    UPDATE_APP_DIMENSIONS = "UPDATE_APP_DIMENSIONS",
    UPDATE_CELL_DIMENSIONS = "UPDATE_CELL_DIMENSIONS",
    UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS"
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
} | {
    type: ActionTypes.UPDATE_PLAYER_STATUS;
    payload: {
        playerId: string;
        status: PlayerStatus;
    };
};
declare type mapState = {
    mapCells: Directions[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
    playerStatusMap: PlayerStatusMap;
};
export declare const mapStateReducer: (state: mapState | undefined, action: Action) => mapState;
export declare const refreshMap: (mapResponse: MapResponse) => (dispatch: Dispatch<AnyAction>, getState: () => mapState) => void;
export declare const updateAppDimensions: (width: number, height: number) => (dispatch: Dispatch<AnyAction>) => void;
export declare const updatePlayerStatus: (playerId: string, newStatus: PlayerStatus) => (dispatch: Dispatch<AnyAction>) => void;
export {};
