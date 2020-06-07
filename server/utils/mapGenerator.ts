import Stack from "./Stack"
import CoordPair, { randomPair } from "./CoordPair"
import Directions, { randomSingleDir, rotateClockwise, getOpposite } from "./Direction";


export const generateMapUsingRandomDFS = () => {
    const dimensions: CoordPair = {x: 15, y: 15}
    const stack: Stack<CoordPair> = new Stack<CoordPair>();
    const startingLocation: CoordPair = randomPair(dimensions);
    const {mapDirections, visited} = emptyMap(dimensions);
    const withinDimensions = (cell: CoordPair) => cell.x >= 0 && cell.y >= 0 && cell.x < dimensions.x && cell.y < dimensions.y;
    const push = (cell: CoordPair) => {
        stack.push(cell);
        visited[cell.y][cell.x] = true;
    }
    push(startingLocation);
    while (!stack.isEmpty()) {
        const currentCell = stack.peek();
        const firstDir = randomSingleDir();
        let dir = firstDir;
        let nextCell = {...currentCell};
        let i = 0;
        while( i < 4 && (!withinDimensions(nextCell) || visited[nextCell.y][nextCell.x])){
            dir = rotateClockwise(dir);
            nextCell = getAdjacentCell(currentCell, dir);
            i++
        }
        if (i === 4 || !withinDimensions(nextCell) || visited[nextCell.y][nextCell.x]) { // we've exhausted all options
            stack.pop();
            continue;
        }
        destroyWall(currentCell, dir, mapDirections);
        push(nextCell);
    }
    return mapDirections;
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

