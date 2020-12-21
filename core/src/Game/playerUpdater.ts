import { playerStore, SPEED_FACTOR } from '.';
import { PlayerStatus } from '../Types/PlayerStatus';
import { Directions, CoordPair, CoordPairUtils, PlayerStore } from '../Types';
import { updatePlayerStatus } from '../ducks/playerState';

export const updatePlayers = () => {
    const psm = playerStore.getState().playerStatusMap;
    Object.keys(psm).forEach(key => movePlayerAlongPath(key, psm[key], SPEED_FACTOR, playerStore));
}

export const movePlayerAlongPath = (playerId: string, status: PlayerStatus, dist: number, store: PlayerStore) => {
    const path = status.path;
    if (path.length > 0) {
        const targetCell = path[0];
        const newStatus = movePlayerTowardsTarget(status, targetCell, dist);
        // console.log(targetCell, newStatus);
        if (isCentered(newStatus.location, targetCell)) {
            newStatus.location = CoordPairUtils.roundedPair(newStatus.location);
            newStatus.path = newStatus.path.slice(1);
            if (newStatus.path.length === 0) {
                newStatus.direction = Directions.NONE;
            }
        }
        // @ts-ignore
        store.dispatch(updatePlayerStatus(playerId, newStatus));
    }
    else if (status.direction !== Directions.NONE) {
        store.dispatch(
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

const movePlayerTowardsTarget = (status: PlayerStatus, targetCell: CoordPair, dist: number = SPEED_FACTOR) => {
    if (dist === 0) {
        return status;
    }
    const newStatus = { ...status, direction: CoordPairUtils.getDirection(status.location, targetCell) }
    switch (newStatus.direction) {
        case Directions.DOWN:
            newStatus.location.y += dist;
            break;
        case Directions.UP:
            newStatus.location.y -= dist;
            break;
        case Directions.RIGHT:
            newStatus.location.x += dist;
            break;
        case Directions.LEFT:
            newStatus.location.x -= dist;
            break;
    }
    return newStatus;
}