import Stack from "./Stack"
import CoordPair, { randomPair } from "./CoordPair"
import Directions, { randomSingleDir, rotateClockwise, getOpposite } from "./Direction";

const EXTRA_DESTRUCTION = 10; // extra walls to demo after maze completed

export const generateMapUsingRandomDFS = () => {
    const dimensions: CoordPair = {x: 10, y: 10}
    const stack: Stack<CoordPair> = new Stack<CoordPair>();
    const start: CoordPair = randomPair(dimensions);
    const {mapDirections, visited} = emptyMap(dimensions);
    const withinDimensions = (cell: CoordPair) => cell.x >= 0 && cell.y >= 0 && cell.x < dimensions.x && cell.y < dimensions.y;
    let deepestNode: { depth: number; cell: CoordPair; } = { depth: 0, cell: start }
    const push = (cell: CoordPair) => {
        stack.push(cell);
        visited[cell.y][cell.x] = true;
        if (deepestNode.depth < stack.size()){
            deepestNode = {depth: stack.size(), cell};
        }
    }
    push(start);
    while (!stack.isEmpty()) {
        const currentCell = stack.peek();
        const firstDir = randomSingleDir();
        let dir = firstDir;
        let nextCell = {...currentCell};
        let i = 0;
        while( i < 4 && (!withinDimensions(nextCell) || visited[nextCell.y][nextCell.x])){
            dir = rotateClockwise(dir);
            nextCell = getAdjacentCell(currentCell, dir);
            i++;
        }
        if (i === 4 || !withinDimensions(nextCell) || visited[nextCell.y][nextCell.x]) { // we've exhausted all options
            stack.pop();
            continue;
        }
        destroyWall(currentCell, dir, mapDirections);
        push(nextCell);
    }
    const startPoints = maxDistPair(mapDirections, deepestNode.cell);
    return { mapDirections, startPoints };
}

const emptyMap = (dimensions: CoordPair) => {
    function* fillEmptyMap<T> (withWhat: T) {
        function* emptyRow(length: number) {
            for (let j = 0; j < length; j++) {
                yield withWhat
            }
        }
        for (let i = 0; i < dimensions.y; i++) {
            yield Array.from(emptyRow(dimensions.x));
        }
    }
    return {mapDirections : Array.from(fillEmptyMap<Directions>(Directions.NONE)), visited: Array.from(fillEmptyMap<boolean>(false)) }
}

const getAdjacentCell = (current: CoordPair, dir: Directions) => {
    switch(dir){
        case Directions.UP:
            return { ...current, y: current.y - 1 };
        case Directions.DOWN:
            return { ...current, y: current.y + 1 };
        case Directions.LEFT:
            return { ...current, x: current.x - 1 };
        case Directions.RIGHT:
            return { ...current, x: current.x + 1 };
        default:
            return current;
    }
}

const destroyWall = (cellA: CoordPair, dir: Directions, mapDirections: Directions[][]) => {
    const cellB = getAdjacentCell(cellA, dir);
    mapDirections[cellA.y][cellA.x] = dir | mapDirections[cellA.y][cellA.x];
    mapDirections[cellB.y][cellB.x] = getOpposite(dir) | mapDirections[cellB.y][cellB.x];
} 

const maxDistPair = (mapDirections: Directions[][], deepestCell: CoordPair) => {
    let cellA = {...deepestCell};
    let cellB = findFarthest(cellA, mapDirections);
    while (true) {
        const cellC = findFarthest(cellB, mapDirections);
        if (cellC.x === cellA.x && cellC.y === cellA.y ) {
            break;
        }
        cellA = {...cellC}
        const cellD = findFarthest(cellA, mapDirections);
        if (cellD.x === cellB.x && cellD.y === cellB.y ) {
            break;
        }
        cellB = {...cellD}
    }
    return { cellA, cellB }
}

const findFarthest = (start: CoordPair, mapDirections: Directions[][]) => {
    const stack = new Stack<CoordPair>();
    const dimensions = { y: mapDirections.length, x: mapDirections[0].length };
    const canMove = (cell: CoordPair, dir: Directions) => (dir === (mapDirections[cell.y][cell.x] & dir));
    const {mapDirections: something, visited} = emptyMap(dimensions);
    let deepestNode: { depth: number; cell: CoordPair; } = { depth: 0, cell: start }
    const push = (cell: CoordPair) => {
        stack.push(cell);
        visited[cell.y][cell.x] = true;
        if (deepestNode.depth < stack.size()){
            deepestNode = {depth: stack.size(), cell};
        }
    }
    push(start);
    while (!stack.isEmpty()) {
        const currentCell = stack.peek();
        const firstDir = randomSingleDir();
        let dir = firstDir;
        const nextCell = () => getAdjacentCell(currentCell, dir);
        let i = 0;
        while( i < 4 && (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x])){
            dir = rotateClockwise(dir);
            i++;
        }
        if (!canMove(currentCell, dir) || visited[nextCell().y][nextCell().x]) { // we've exhausted all options
            stack.pop();
            continue;
        }
        push(nextCell());
    }
    return deepestNode.cell;
}

