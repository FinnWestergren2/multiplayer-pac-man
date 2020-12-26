import { gameStore, SPEED_FACTOR } from '.';
import { ObjectStatus } from '../Types/GameState';
import { Directions, CoordPair, CoordPairUtils, DirectionsUtils } from '../Types';
import { popPlayerPath, updatePlayerStatus } from '../ducks/gameState';

const idleStatus = (location: CoordPair) => {
    return {
        location: CoordPairUtils.roundedPair(location), // snap to grid
        direction: Directions.NONE
    }
};

export const updatePlayers = () => gameStore.getState().playerList.forEach(playerId => {
    const status = gameStore.getState().objectStatusDict[playerId];
    const path = gameStore.getState().objectPathDict[playerId];
    if (path) {
        const newStatus = moveObjectAlongPath(SPEED_FACTOR, path, status, () => popPlayerPath(gameStore, playerId));
        updatePlayerStatus(gameStore, playerId, newStatus);
        return;
    }
    if (!path && status && status.direction !== Directions.NONE) {
        updatePlayerStatus(gameStore, playerId, idleStatus(status.location));
    }
});

export const moveObjectAlongPath: (dist: number, path: CoordPair[], status: ObjectStatus, popPath: () => void) => ObjectStatus = (dist, path, status, popPath) => {
    if (dist === 0) {
        return status;
    }
    if (path.length === 0) {
        return idleStatus(status.location);
    }
    path = checkCurrentPathStatus(status, path, popPath); 
    let nextLocation = CoordPairUtils.snappedPair(status.location);
    let nextDirection = status.direction;
    let remainingDist = dist;
    for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
        const targetCell = path[pathIndex];
        nextDirection = CoordPairUtils.getDirection(nextLocation, targetCell)
        const distToCell = Math.sqrt(CoordPairUtils.distSquared(nextLocation, targetCell));
        if (remainingDist > distToCell) {
            nextLocation = { ...targetCell };
            continue;
        }
        switch (nextDirection) {
            case Directions.DOWN:
                nextLocation.y += remainingDist;
                break;
            case Directions.UP:
                nextLocation.y -= remainingDist;
                break;
            case Directions.RIGHT:
                nextLocation.x += remainingDist;
                break;
            case Directions.LEFT:
                nextLocation.x -= remainingDist;
                break;
        }
        break;
    }
    return { location: nextLocation, direction: nextDirection };
}

const checkCurrentPathStatus = (status: ObjectStatus, path: CoordPair[], popPath: () => void) => {
    let out = [...path]
    for(let i = 0; i < path.length - 1; i++ ) {
        const firstDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(status.location), path[i]);
        const secondDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(status.location), path[i + 1]);
        if (DirectionsUtils.getOpposite(firstDir) === secondDir) {
            out = out.slice(1);
            popPath();
            break;
        }
    }
    return out;
}


