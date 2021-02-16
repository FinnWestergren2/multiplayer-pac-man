import { createSelector } from 'reselect'
import { Direction, MapState } from '../types'
import { preProcessMap } from './mapProcessing'

const mapCellsSelector = (state: MapState) => state.mapCells

export const junctionSelector = createSelector(
    mapCellsSelector,
    (cells: Direction[][]) => { console.log(cells[0]); return preProcessMap(cells); }
);