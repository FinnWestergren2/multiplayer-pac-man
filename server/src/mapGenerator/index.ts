import Stack from "./Stack"
import { CoordPair, Directions, CoordPairUtils, DirectionsUtils,  MapResponse } from "core"

export const generateMapUsingRandomDFS: () => MapResponse = () => {
    const dimensions: CoordPair = { x: 7, y: 7 }
    const stack: Stack<CoordPair> = new Stack<CoordPair>();
    const start: CoordPair = CoordPairUtils.randomPair(dimensions);
    const { mapDirections, visited } = emptyMap(dimensions);
    const withinDimensions = (cell: CoordPair) => cell.x >= 0 && cell.y >= 0 && cell.x < dimensions.x && cell.y < dimensions.y;
    let deepestNode: { depth: number; cell: CoordPair; } = { depth: 0, cell: start }
    const push = (cell: CoordPair) => {
        stack.push(cell);
        visited[cell.y][cell.x] = true;
        if (deepestNode.depth < stack.size()) {
            deepestNode = { depth: stack.size(), cell };
        }
    }
    push(start);
    while (!stack.isEmpty()) {
        const currentCell = stack.peek();
        const firstDir = DirectionsUtils.randomSingleDirection();
        let dir = firstDir;
        let nextCell = { ...currentCell };
        let i = 0;
        while (i < 4 && (!withinDimensions(nextCell) || visited[nextCell.y][nextCell.x])) {
            dir = DirectionsUtils.rotateClockwise(dir);
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
    return mapDirections;
}

export const emptyMap = (dimensions: CoordPair) => {
    function* fillEmptyMap<T>(emptyValue: T) {
        function* emptyRow(length: number) {
            for (let j = 0; j < length; j++) {
                yield emptyValue;
            }
        }
        for (let i = 0; i < dimensions.y; i++) {
            yield Array.from(emptyRow(dimensions.x));
        }
    }
    return { mapDirections: Array.from(fillEmptyMap<Directions>(Directions.NONE)), visited: Array.from(fillEmptyMap<boolean>(false)) }
}

export const getAdjacentCell = (current: CoordPair, dir: Directions) => {
    switch (dir) {
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
    mapDirections[cellB.y][cellB.x] = DirectionsUtils.getOpposite(dir) | mapDirections[cellB.y][cellB.x];
}

