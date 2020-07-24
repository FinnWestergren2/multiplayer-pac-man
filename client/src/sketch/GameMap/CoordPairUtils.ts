import { MapStore } from "../../containers/GameWrapper";
import { CoordPair, Directions } from "shared";

// these methods could get moved to reselect if we want a performance boost
export const getCellType = (gridCoords: CoordPair) => {
    try {
        return MapStore.getState().mapCells[gridCoords.y][gridCoords.x];
    } catch (error) {
        return Directions.NONE;
    }
};

// returns the absolute center of a cell
export const toLocationCoords = (gridCoords: CoordPair) => {
    const halfCellSize = MapStore.getState().cellDimensions.halfCellSize;
    return {
        x: (gridCoords.x) * (halfCellSize * 2) + halfCellSize,
        y: (gridCoords.y) * (halfCellSize * 2) + halfCellSize
    };
};

// definitely the most expensive method, memoize this first
export const toGridCoords: (locationCoords: CoordPair) => CoordPair = (locationCoords) => {
    const factor = 1 / MapStore.getState().cellDimensions.cellSize;
    return { x: Math.floor(locationCoords.x * factor), y: Math.floor(locationCoords.y * factor) };
};
