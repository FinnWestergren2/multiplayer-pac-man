import { store, CELLS_PER_MILLISECOND } from '.';
import { ActorStatus } from '../types/actor';
import { Direction, CoordPair, CoordPairUtils, DirectionUtils } from '../types';
import { popActorPath, updateActorStatus } from '../ducks/actorState';
import { getAverageFrameLength } from './frameManager';
import { junctionSelector, MapNode } from '../map';
import { tieAllNodes } from '../map/mapProcessing';
import PriorityQueue from '../utils/PriorityQueue';

const idleStatus = (location: CoordPair) => {
    return {
        location: CoordPairUtils.roundedPair(location), // snap to grid
        direction: Direction.NONE
    }
};

export const updateActors = () => Object.keys(store.getState().actorState.actorDict).forEach(actorId => {
    const status = store.getState().actorState.actorDict[actorId].status;
    const path = store.getState().actorState.actorPathDict[actorId];
    if (path) {
        const newStatus = moveActorAlongPath(CELLS_PER_MILLISECOND * getAverageFrameLength(), path, status, () => popActorPath(store, actorId));
        updateActorStatus(store, actorId, newStatus);
        return;
    }
    if (!path && status && status.direction !== Direction.NONE) {
        updateActorStatus(store, actorId, idleStatus(status.location));
    }
});

export const moveActorAlongPath: (dist: number, path: CoordPair[], status: ActorStatus, popPath: () => void) => ActorStatus = (dist, path, status, popPath) => {
    if (dist === 0) return status;
    if (path.length === 0) return idleStatus(status.location);
    
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
    for(let i = 0; i < path.length - 1; i++) {
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
    const visitedTable = store.getState().mapState.mapCells.map(row => row.map(() => { return { isVisited: false, parentCell: {x: -1, y: -1}}} ));
    visitedTable[startCell.y][startCell.x].isVisited = true;

    const getAllBranches = (location: CoordPair) => {
        const branches: CoordPair[] = []
        const x = Math.floor(location.x);
        const y = Math.floor(location.y);
        const directions = store.getState().mapState.mapCells[y][x];
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

type WeightedNode = {
    node: MapNode;
    weight: number
}

const createdWeightedNode: (node: MapNode, weight: number) => WeightedNode = (node, weight) => {
    return { node, weight }
}

export const Dijkstras: (startCell: CoordPair, endCell: CoordPair) => {totalDist: number, path: CoordPair[]} = (startCell, endCell) => {
    const junctions = junctionSelector(store.getState().mapState); // we need to copy here because we add temporary nodes to solve
    const startNode = new MapNode(startCell.x, startCell.y);
    tieAllNodes(startNode, junctions, store.getState().mapState.mapCells[startCell.y][startCell.x]);
    const queue = new PriorityQueue<WeightedNode>((a, b) => a.weight < b.weight);
    queue.push(createdWeightedNode(startNode, 0));
    const visitedTable: { totalDist: number, parentNode: WeightedNode | null }[][] = store.getState().mapState.mapCells.map(row => row.map(() => { return { totalDist: Number.POSITIVE_INFINITY, parentNode: null }} ));
    visitedTable[startCell.y][startCell.x].totalDist = 0;

    const checkForEndNode = (currentNode: MapNode, neighbor: MapNode) => {
        if (currentNode.x === neighbor.x && endCell.x === currentNode.x) {
            return (endCell.y > currentNode.y && endCell.y < neighbor.y) || (endCell.y < currentNode.y && endCell.y > neighbor.y)
        }

        if (currentNode.y === neighbor.y && endCell.y === currentNode.y) {
            return (endCell.x > currentNode.x && endCell.x < neighbor.x) || (endCell.x < currentNode.x && endCell.x > neighbor.x)
        }
    }

    while (queue.size() > 0) {
        const currentNode = queue.pop();
        const neighbors = currentNode.node.neighbors.filter(n => n !== null) as MapNode[];
        const weightedNeighbors = neighbors.map(n => {
            const location: CoordPair = { x: n.x, y: n.y };
            const dist = currentNode.weight + CoordPairUtils.distDirect(location, { x: currentNode.node.x, y: currentNode.node.y });
            return createdWeightedNode(n, dist)
        }).filter(n => (visitedTable[n.node.y][n.node.x].totalDist > n.weight));

        weightedNeighbors.forEach(n => {
            visitedTable[n.node.y][n.node.x].totalDist = n.weight;
            visitedTable[n.node.y][n.node.x].parentNode = currentNode;
        });

        if (neighbors.some(n => checkForEndNode(currentNode.node, n))) {
            const dist = CoordPairUtils.distDirect(endCell, { x: currentNode.node.x, y: currentNode.node.y });
            if (visitedTable[endCell.y][endCell.x].totalDist > currentNode.weight + dist) {
                visitedTable[endCell.y][endCell.x].totalDist = currentNode.weight + dist;
                visitedTable[endCell.y][endCell.x].parentNode = currentNode;
            }
        }

        queue.push(...weightedNeighbors);
    }

    // we reverse the list at the end
    let output = [endCell];
    while (!CoordPairUtils.equalPairs(output[output.length - 1], startCell)) {
        const currentCell = output[output.length - 1];
        const parent = visitedTable[currentCell.y][currentCell.x].parentNode?.node;
        if (!parent) {
            return {totalDist : -1, path: []};
        }
        output = [...output, { x: parent!.x, y: parent!.y }];
    }
    const totalDist = visitedTable[endCell.y][endCell.x].totalDist;
    return {totalDist, path: output.reverse()};
}
