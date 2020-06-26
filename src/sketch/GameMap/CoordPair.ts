import { GlobalStore } from "../../containers/GameWrapper";
import Directions from "./Direction";

type CoordPair = { x: number; y: number }
export const zeroPair = { x: 0, y: 0 };
export const addPairs = (p1: CoordPair, p2: CoordPair) => {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
};

// these methods could get moved to reselect if we want a performance boost
export const getCellType = (gridCoords: CoordPair) => {
    try {
        return GlobalStore.getState().mapState.mapCells[gridCoords.y][gridCoords.x];
    } catch (error) {
        return Directions.NONE;
    }
};

// returns the absolute center of a cell
export const toLocationCoords = (gridCoords: CoordPair) => {
    const halfCellSize = GlobalStore.getState().mapState.cellDimensions.halfCellSize;
    return {
        x: (gridCoords.x) * (halfCellSize * 2) + halfCellSize,
        y: (gridCoords.y) * (halfCellSize * 2) + halfCellSize
    };
};

// definitely the most expensive method, memoize this first
export const toGridCoords: (locationCoords: CoordPair) => CoordPair = (locationCoords) => {
    const factor = 1 / GlobalStore.getState().mapState.cellDimensions.cellSize;
    return { x: Math.floor(locationCoords.x * factor), y: Math.floor(locationCoords.y * factor) };
};

export default CoordPair;