import { playerStore, mapStore, SPEED_FACTOR } from '.';
import { PlayerStatus } from '../Types/PlayerStatus';
import { Directions, DirectionsUtils, CoordPair, CoordPairUtils, PlayerStateActionTypes } from '../Types';
import { updatePlayerStatus } from '../ducks/playerState';

export const updatePlayers = () => {
    const psm = playerStore.getState().playerStatusMap;
    const map = mapStore.getState().mapCells;
    Object.keys(psm).forEach(key => updatePlayer(key, psm[key], map));
}

const updatePlayer = (playerId: string, status: PlayerStatus, map: Directions[][]) => {

    const currentCell = CoordPairUtils.flooredPair(status.location);
    // bitwise compatability check
    if (status.direction === (map[currentCell.y][currentCell.x] & status.direction)) {

    }
}

const snapToGrid = (location: CoordPair, playerId: string, status: PlayerStatus) => {
    const halfCellSize = mapStore.getState().cellDimensions.halfCellSize;
    const target = CoordPairUtils.addPairs(CoordPairUtils.flooredPair(location), { x: halfCellSize, y: halfCellSize });
    const snapX = Math.abs(location.x - target.x) < SPEED_FACTOR;
    const snapY = Math.abs(location.x - target.x) < SPEED_FACTOR;
    if (snapX) {
        location.x = target.x;
    }
    if (snapY) {
        location.y = target.y;
    }
    updatePlayerStatus(playerId, { ...status, location })
};