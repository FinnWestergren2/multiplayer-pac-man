import { playerStore, SPEED_FACTOR } from '.';
import { PlayerStatus } from '../Types/PlayerStatus';
import { Directions, CoordPair, CoordPairUtils } from '../Types';
import { updatePlayerStatus, popPlayerPath } from '../ducks/playerState';

export const updatePlayers = () => {
    const psm = playerStore.getState().playerStatusMap;
    Object.keys(psm).forEach(key => updatePlayer(key, psm[key]));
}

const updatePlayer = (playerId: string, status: PlayerStatus) => {
    const path = playerStore.getState().playerPaths[playerId];
    if (path && path.length > 0) {
        const targetCell = path[0];
        const newStatus = movePlayerTowardsTarget(status, targetCell);
        // console.log(targetCell, newStatus);
        if (isCentered(newStatus.location, targetCell)) {
            popPlayerPath(playerStore, playerId);
            newStatus.location = CoordPairUtils.roundedPair(newStatus.location);
            if (path.length === 1) {
                newStatus.direction = Directions.NONE;
            }
        }
        // @ts-ignore
        playerStore.dispatch(updatePlayerStatus(playerId, newStatus));
    }
    else if (status.direction !== Directions.NONE) {
        playerStore.dispatch(
            //@ts-ignore
            updatePlayerStatus(playerId, { 
                location: CoordPairUtils.roundedPair(status.location), 
                direction: Directions.NONE 
            })
        );
    }
}

const isCentered = (location: CoordPair, target: CoordPair) => {
    const centeredX = Math.abs(location.x - target.x) < SPEED_FACTOR;
    const centeredY = Math.abs(location.y - target.y) < SPEED_FACTOR;
    return centeredX && centeredY;
};

const movePlayerTowardsTarget = (status: PlayerStatus, targetCell: CoordPair) => {
const newStatus = { location: status.location, direction: CoordPairUtils.getDirection(status.location, targetCell) } 
    switch (newStatus.direction) {
        case Directions.DOWN:
            newStatus.location.y += SPEED_FACTOR;
            break;
        case Directions.UP:
            newStatus.location.y -= SPEED_FACTOR;
            break;
        case Directions.RIGHT:
            newStatus.location.x += SPEED_FACTOR;
            break;
        case Directions.LEFT:
            newStatus.location.x -= SPEED_FACTOR;
            break;
    }
    return newStatus;
}