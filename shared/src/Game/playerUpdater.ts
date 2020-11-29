import { playerStore, SPEED_FACTOR } from '.';
import { PlayerStatus } from '../Types/PlayerStatus';
import { Directions, CoordPair, CoordPairUtils } from '../Types';
import { updatePlayerStatus, popPlayerPath } from '../ducks/playerState';

export const updatePlayers = () => {
    const psm = playerStore.getState().playerStatusMap;
    Object.keys(psm).forEach(key => updatePlayer(key, psm[key]));
}

const updatePlayer = (playerId: string, status: PlayerStatus) => {
    movePlayer(playerId, status);
    const currentCell = CoordPairUtils.flooredPair(status.location);
    const path = playerStore.getState().playerPaths[playerId];
    let targetCell = currentCell;
    if (path && path.length > 0) {
        targetCell = path[0];
    }
    if (snapToGrid(playerId, status, targetCell) && path && path.length > 0) {
        popPlayerPath(playerStore, playerId);
    }
}

const snapToGrid = (playerId: string, status: PlayerStatus, target: CoordPair) => {
    const location = { ...status.location };
    const snapX = Math.abs(location.x - target.x) < SPEED_FACTOR;
    const snapY = Math.abs(location.y - target.y) < SPEED_FACTOR;
    if (snapX) {
        location.x = target.x;
    }
    if (snapY) {
        location.y = target.y;
    }

    // @ts-ignore
    playerStore.dispatch(updatePlayerStatus(playerId, { ...status, location }));
    return snapX && snapY;
};

const movePlayer = (playerId: string, status: PlayerStatus) => {
const newLocation = { ...status.location } 
    switch(status.direction){
        case Directions.DOWN:
            newLocation.y += SPEED_FACTOR;
            break;
        case Directions.UP:
            newLocation.y -= SPEED_FACTOR;
            break;
        case Directions.RIGHT:
            newLocation.x += SPEED_FACTOR;
            break;
        case Directions.LEFT:
            newLocation.x -= SPEED_FACTOR;
            break;

    }
    // @ts-ignore
    playerStore.dispatch(updatePlayerStatus(playerId, { ...status, location: newLocation }));
}