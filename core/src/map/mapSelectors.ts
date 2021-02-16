import { createSelector } from 'reselect'
import { Direction, MapState } from '../types'
import { preProcessMap } from './mapProcessing'

const mapCellsSelector = (state: MapState) => state.mapCells

export const junctionSelector = createSelector(
    mapCellsSelector,
    preProcessMap
);