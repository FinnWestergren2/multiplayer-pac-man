import { AnyAction, Dispatch } from "redux";
import { MapResponse } from "..";
import { MapState, MapStateAction } from "../Types/ReduxTypes";
export declare const mapStateReducer: (state: MapState | undefined, action: MapStateAction) => MapState;
export declare const refreshMap: (mapResponse: MapResponse) => (dispatch: Dispatch<AnyAction>, getState: () => MapState) => void;
export declare const updateAppDimensions: (width: number, height: number) => (dispatch: Dispatch<AnyAction>, getState: () => MapState) => void;
