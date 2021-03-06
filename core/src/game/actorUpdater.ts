import { store, CELLS_PER_MILLISECOND } from '.';
import { ActorStatus } from '../types/actor';
import { Direction, CoordPair, CoordPairUtils, DirectionUtils } from '../types';
import { updateActorStatus } from '../ducks/actorState';
import { getAverageFrameLength } from './frameManager';
import { getActorPath } from '../selectors/actorSelectors';

export const updateActors = () => Object.keys(store.getState().actorState.actorDict).forEach(actorId => {
    moveActorAlongPath(CELLS_PER_MILLISECOND * getAverageFrameLength(), actorId);
});

export const moveActorAlongPath = (distance: number, actorId: string) => {
    const newStatus = getNextDestinationAlongPath(distance, actorId);
    if (newStatus) {
        updateActorStatus(store, actorId, newStatus);
    }
}

export const getNextDestinationAlongPath: (dist: number, actorId: string) => ActorStatus | null = (dist, actorId) => {
    const status = store.getState().actorState.actorDict[actorId].status;
    if (dist === 0 || !status.destination) return null;
    if (CoordPairUtils.equalPairs(status.location, status.destination)) {
        return { ...status, destination: undefined };
    }
    const path = checkCurrentPathStatus(status, getActorPath(store.getState(), actorId).path); 
    let nextLocation = CoordPairUtils.snappedPair(status.location);
    let nextDirection = status.orientation;
    let remainingDist = dist;
    for (let pathIndex = 0; pathIndex < path.length; pathIndex++) {
        const targetCell = path[pathIndex];
        nextDirection = CoordPairUtils.getDirection(nextLocation, targetCell)
        const distToCell = Math.sqrt(CoordPairUtils.distSquared(nextLocation, targetCell));
        if (remainingDist > distToCell) {
            nextLocation = { ...targetCell };
            remainingDist -= distToCell;
            continue;
        }
        switch (nextDirection) {
            case Direction.DOWN:
                nextLocation.y += remainingDist;
                break;
            case Direction.UP:
                nextLocation.y -= remainingDist;
                break;
            case Direction.RIGHT:
                nextLocation.x += remainingDist;
                break;
            case Direction.LEFT:
                nextLocation.x -= remainingDist;
                break;
        }
        break;
    }
    return { ...status, location: nextLocation, orientation: nextDirection };
}

const checkCurrentPathStatus = (status: ActorStatus, path: CoordPair[]) => {
    let out = [...path]
    for(let i = 0; i < path.length - 1; i++) {
        const firstDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(status.location), path[i]);
        const secondDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(status.location), path[i + 1]);
        if (DirectionUtils.getOpposite(firstDir) === secondDir) {
            out = out.slice(1);
            break;
        }
    }
    return out;
}
