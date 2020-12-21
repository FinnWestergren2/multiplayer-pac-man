import { playerStore, SPEED_FACTOR } from '.';
import { ObjectStatus } from '../Types/GameState';
import { Directions, CoordPair, CoordPairUtils } from '../Types';
import { updatePlayerStatus } from '../ducks/playerState';
import { BFS } from '../Utils/Pathfinding';

const idleStatus = (location: CoordPair) => {
    return {
        location: CoordPairUtils.roundedPair(location), // snap to grid
        direction: Directions.NONE
    }
};

export const updatePlayers = () => playerStore.getState().playerList.forEach(playerId => {
    const status = playerStore.getState().objectStatusDict[playerId];
    const dest = playerStore.getState().objectDestinationDict[playerId];
    if (dest) {
        const path = BFS(status.location, dest);
        const newStatus = moveObjectAlongPath(SPEED_FACTOR, path, status);
        // @ts-ignore
        playerStore.dispatch(updatePlayerStatus(playerId, newStatus));
        return;
    }
    if (!dest && status && status.direction !== Directions.NONE) {
        // @ts-ignore
        playerStore.dispatch(updatePlayerStatus(playerId, idleStatus(status.location)));
    }
});

export const moveObjectAlongPath: (dist: number, path: CoordPair[], status: ObjectStatus) => ObjectStatus = (dist, path, status) => {
    if (dist === 0 || path.length === 0) {
        return idleStatus(status.location);
    }
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
