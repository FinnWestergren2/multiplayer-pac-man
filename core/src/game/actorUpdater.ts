import { gameStore, mapStore, SPEED_FACTOR } from '.';
import { ActorStatus } from '../types/actor';
import { Direction, CoordPair, CoordPairUtils, DirectionUtils } from '../types';
import { popActorPath, updateActorStatus } from '../ducks/gameState';

const idleStatus = (location: CoordPair) => {
    return {
        location: CoordPairUtils.roundedPair(location), // snap to grid
        direction: Direction.NONE
    }
};

export const updateActors = () => Object.keys(gameStore.getState().actorDict).forEach(actorId => {
    const status = gameStore.getState().actorDict[actorId].status;
    const path = gameStore.getState().actorPathDict[actorId];
    if (path) {
        const newStatus = moveActorAlongPath(SPEED_FACTOR, path, status, () => popActorPath(gameStore, actorId));
        updateActorStatus(gameStore, actorId, newStatus);
        return;
    }
    if (!path && status && status.direction !== Direction.NONE) {
        updateActorStatus(gameStore, actorId, idleStatus(status.location));
    }
});

export const moveActorAlongPath: (dist: number, path: CoordPair[], status: ActorStatus, popPath: () => void) => ActorStatus = (dist, path, status, popPath) => {
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
    return { location: nextLocation, direction: nextDirection };
}

const checkCurrentPathStatus = (status: ActorStatus, path: CoordPair[], popPath: () => void) => {
    let out = [...path]
    for(let i = 0; i < path.length - 1; i++ ) {
        const firstDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(status.location), path[i]);
        const secondDir = CoordPairUtils.getDirection(CoordPairUtils.snappedPair(status.location), path[i + 1]);
        if (DirectionUtils.getOpposite(firstDir) === secondDir) {
            out = out.slice(1);
            popPath();
            break;
        }
    }
    return out;
}

export const BFS: (startFloat: CoordPair, endCell: CoordPair) => CoordPair[] = (startFloat, endCell) => {
    const startCell = CoordPairUtils.roundedPair(startFloat);
    if(CoordPairUtils.equalPairs(startCell, endCell)){
        return [startCell];
    }
    let queue = [startCell];
    let popIndex = 0;
    const mapCells = mapStore.getState().mapCells.map(row => row.map(col => { return { dir: col, isVisited: false, parentCell: {x: -1, y: -1}, depth: 0 }} ));
    mapCells[startCell.y][startCell.x].isVisited = true;

    const getAllBranches = (location: CoordPair) => {
        const branches: CoordPair[] = []
        const x = Math.floor(location.x);
        const y = Math.floor(location.y);
        const directions = mapCells[y][x].dir;
        if (mapCells[y + 1] && mapCells[y + 1][x] && DirectionUtils.isDown(directions) && !mapCells[y + 1][x].isVisited){
            branches.push({x: x, y: y + 1});
            mapCells[y + 1][x].isVisited = true;
            mapCells[y + 1][x].parentCell = location;
        }
        if (mapCells[y - 1] && mapCells[y - 1][x] && DirectionUtils.isUp(directions) && !mapCells[y - 1][x].isVisited){
            branches.push({x: x, y: y - 1});
            mapCells[y - 1][x].isVisited = true;
            mapCells[y - 1][x].parentCell = location;
        }
        if (mapCells[y] && mapCells[y][x + 1] && DirectionUtils.isRight(directions) && !mapCells[y][x + 1].isVisited){
            branches.push({x: x + 1, y: y});
            mapCells[y][x + 1].isVisited = true;
            mapCells[y][x + 1].parentCell = location;
        }
        if (mapCells[y] && mapCells[y][x - 1] && DirectionUtils.isLeft(directions) && !mapCells[y][x - 1].isVisited){
            branches.push({x: x - 1, y: y});
            mapCells[y][x - 1].isVisited = true;
            mapCells[y][x - 1].parentCell = location;
        }
        return branches;
    }

    while (true) {
        if (popIndex >= queue.length) {
            return [];
        }
        const branches = getAllBranches(queue[popIndex]);
        if (branches.some(b => CoordPairUtils.equalPairs(b, endCell))){
            break;
        }
        queue = [...queue, ...branches];
        popIndex++;
    }

    // we reverse the list at the end
    let output = [endCell]
    while (!CoordPairUtils.equalPairs(output[output.length - 1], startCell)) {
        const currentCell = output[output.length - 1];
        output = [...output, mapCells[currentCell.y][currentCell.x].parentCell];
    }
    return output.reverse();
}
