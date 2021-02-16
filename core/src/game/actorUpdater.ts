import { gameStore, mapStore, CELLS_PER_MILLISECOND } from '.';
import { ActorStatus } from '../types/actor';
import { Direction, CoordPair, CoordPairUtils, DirectionUtils } from '../types';
import { popActorPath, updateActorStatus } from '../ducks/gameState';
import { getAverageFrameLength } from './frameManager';
import { junctionSelector, MapNode } from '../map';
import { tieAllNodes } from '../map/mapProcessing';

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
        const newStatus = moveActorAlongPath(CELLS_PER_MILLISECOND * getAverageFrameLength(), path, status, () => popActorPath(gameStore, actorId));
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
    const visitedTable = mapStore.getState().mapCells.map(row => row.map(() => { return { isVisited: false, parentCell: {x: -1, y: -1}}} ));
    visitedTable[startCell.y][startCell.x].isVisited = true;

    const getAllBranches = (location: CoordPair) => {
        const branches: CoordPair[] = []
        const x = Math.floor(location.x);
        const y = Math.floor(location.y);
        const directions = mapStore.getState().mapCells[y][x];
        if (visitedTable[y + 1] && visitedTable[y + 1][x] && DirectionUtils.isDown(directions) && !visitedTable[y + 1][x].isVisited){
            branches.push({x: x, y: y + 1});
            visitedTable[y + 1][x].isVisited = true;
            visitedTable[y + 1][x].parentCell = location;
        }
        if (visitedTable[y - 1] && visitedTable[y - 1][x] && DirectionUtils.isUp(directions) && !visitedTable[y - 1][x].isVisited){
            branches.push({x: x, y: y - 1});
            visitedTable[y - 1][x].isVisited = true;
            visitedTable[y - 1][x].parentCell = location;
        }
        if (visitedTable[y] && visitedTable[y][x + 1] && DirectionUtils.isRight(directions) && !visitedTable[y][x + 1].isVisited){
            branches.push({x: x + 1, y: y});
            visitedTable[y][x + 1].isVisited = true;
            visitedTable[y][x + 1].parentCell = location;
        }
        if (visitedTable[y] && visitedTable[y][x - 1] && DirectionUtils.isLeft(directions) && !visitedTable[y][x - 1].isVisited){
            branches.push({x: x - 1, y: y});
            visitedTable[y][x - 1].isVisited = true;
            visitedTable[y][x - 1].parentCell = location;
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
        output = [...output, visitedTable[currentCell.y][currentCell.x].parentCell];
    }
    return output.reverse();
}

// this pathing method takes up around 22% less memory in redux than the pathing method above. More on maps with long corridors, less on maps with a lot of junctions.
export const BFSWithNodes: (startCell: CoordPair, endCell: CoordPair) => CoordPair[] = (startCell, endCell) => {
    const junctions = junctionSelector(mapStore.getState()); // we need to copy here because we add temporary nodes to solve
    const startNode = new MapNode(startCell.x, startCell.y);
    tieAllNodes(startNode, junctions, mapStore.getState().mapCells[startCell.y][startCell.x]);
    const queue = [startNode];
    const visitedTable: { isVisited: boolean, parentNode: MapNode | null }[][] = mapStore.getState().mapCells.map(row => row.map(() => { return { isVisited: false, parentNode: null }} ));
    visitedTable[startCell.y][startCell.x].isVisited = true;

    const checkForEndNode = (currentNode: MapNode, neighbor: MapNode) => {
        if (currentNode.x === neighbor.x && endCell.x === currentNode.x) {
            return (endCell.y > currentNode.y && endCell.y < neighbor.y) || (endCell.y < currentNode.y && endCell.y > neighbor.y)
        }

        if (currentNode.y === neighbor.y && endCell.y === currentNode.y) {
            return (endCell.x > currentNode.x && endCell.x < neighbor.x) || (endCell.x < currentNode.x && endCell.x > neighbor.x)
        }
    }

    while (queue.length > 0) {
        const currentNode = queue.splice(0,1)[0];
        const neighbors: MapNode[] = currentNode.neighbors.filter(n => n !== null && !visitedTable[n.y][n.x].isVisited) as MapNode[];
        neighbors.forEach(n => {
            visitedTable[n.y][n.x].isVisited = true;
            visitedTable[n.y][n.x].parentNode = currentNode;
        });
        if (neighbors.some(n => checkForEndNode(currentNode, n))) {
            visitedTable[endCell.y][endCell.x].parentNode = currentNode;
            break;
        }
        queue.push(...neighbors);
    }

    // we reverse the list at the end
    let output = [endCell];
    while (!CoordPairUtils.equalPairs(output[output.length - 1], startCell)) {
        const currentCell = output[output.length - 1];
        const parent = visitedTable[currentCell.y][currentCell.x].parentNode as MapNode
        output = [...output, { x: parent.x, y: parent.y }];
    }
    return output.reverse();
}
