import Directions from "../sketch/GameMap/directions";
import { loadMap } from "../xhr/loader";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import CoordPair, { zeroPair } from "../sketch/GameMap/CoordPair";

enum ActionTypes {
    REFRESH_MAP = "REFRESH_MAP",
    UPDATE_APP_DIMENSIONS = "UPDATE_APP_DIMENSIONS",
    UPDATE_CELL_DIMENSIONS = "UPDATE_CELL_DIMENSIONS",
    UPDATE_PLAYER_LOCATIONS =  "UPDATE_PLAYER_LOCATIONS"
}

export type AppDimensions = {
    canvasHeight: number;
    canvasWidth: number;
}

export type CellDimensions = {
    cellSize: number;
    halfCellSize: number;
}

type CoordPairPair = {
    cellA: CoordPair;
    cellB: CoordPair;
}

type Action = 
    {type: ActionTypes.REFRESH_MAP; payload: Directions[][]} |
    {type: ActionTypes.UPDATE_APP_DIMENSIONS; payload: AppDimensions} | 
    {type: ActionTypes.UPDATE_CELL_DIMENSIONS; payload: CellDimensions} |
    {type: ActionTypes.UPDATE_PLAYER_LOCATIONS; payload: CoordPairPair}

type mapState = {
    mapCells: Directions[][];
    appDimensions: AppDimensions;
    cellDimensions: CellDimensions;
    playerLocations: CoordPairPair;
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
    playerLocations: {
        cellA: {...zeroPair},
        cellB: {...zeroPair}
    }
};

export default (state: mapState = initialState, action: Action) => {
    switch (action.type) {
        case ActionTypes.REFRESH_MAP:
            return { ...state, mapCells: action.payload };
        case ActionTypes.UPDATE_APP_DIMENSIONS:
            return { ...state, appDimensions: action.payload };
        case ActionTypes.UPDATE_CELL_DIMENSIONS:
                return { ...state, cellDimensions: action.payload };
        case ActionTypes.UPDATE_PLAYER_LOCATIONS:
            return { ...state, playerLocations: action.payload };
        default:
            return state;
    }
};

export const refreshMap: () => ThunkAction<void, mapState, {}, AnyAction> = () => {
    return function(dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) {
        loadMap().then(response => {
            dispatch({type: ActionTypes.REFRESH_MAP, payload: response.mapDirections });
            dispatch({type: ActionTypes.UPDATE_CELL_DIMENSIONS, payload: generateCellDimensions(response.mapDirections, getState().mapState.appDimensions)});
            dispatch({type: ActionTypes.UPDATE_PLAYER_LOCATIONS, payload: response.startPoints});
        });
    };
};

export const updateAppDimensions = (width: number, height: number) => {
    return function(dispatch: ThunkDispatch<{}, {}, AnyAction>) {
        dispatch({type: ActionTypes.UPDATE_APP_DIMENSIONS, payload: {canvasHeight: height, canvasWidth: width}});
    };
};

const generateCellDimensions = (data: Directions[][], appDimensions: AppDimensions) => {
    const size = Math.min(
        (appDimensions.canvasWidth-1)/Math.max(...(data.map(r => r.length))),
        (appDimensions.canvasHeight-1)/data.length);
    
    return {
        cellSize: size,
        halfCellSize: size * 0.5
    };
};