import Stack from "./Stack"
import { CoordPair, Direction, CoordPairUtils, DirectionUtils,  MapResponse } from "core"

export const generateMapUsingRandomDFS: () => MapResponse = () => {
    const dimensions: CoordPair = { x: 16, y: 16 }
    const stack: Stack<CoordPair> = new Stack<CoordPair>();
    const start: CoordPair = CoordPairUtils.randomPair(dimensions);
    const { mapCells, visited } = emptyMap(dimensions);
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
        const firstDir = DirectionUtils.randomSingleDirection();
        let dir = firstDir;
        let nextCell = { ...currentCell };
        let i = 0;
        while (i < 4 && (!withinDimensions(nextCell) || visited[nextCell.y][nextCell.x])) {
            dir = DirectionUtils.rotateClockwise(dir);
            nextCell = getAdjacentCell(currentCell, dir);
            i++;
        }
        if (i === 4 || !withinDimensions(nextCell) || visited[nextCell.y][nextCell.x]) { // we've exhausted all options
            stack.pop();
            continue;
        }
        destroyWall(currentCell, dir, mapCells);
        push(nextCell);
    }
    return mapCells;
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
    return { mapCells: Array.from(fillEmptyMap<Direction>(Direction.NONE)), visited: Array.from(fillEmptyMap<boolean>(false)) }
}

export const getAdjacentCell = (current: CoordPair, dir: Direction) => {
    switch (dir) {
        case Direction.UP:
            return { ...current, y: current.y - 1 };
        case Direction.DOWN:
            return { ...current, y: current.y + 1 };
        case Direction.LEFT:
            return { ...current, x: current.x - 1 };
        case Direction.RIGHT:
            return { ...current, x: current.x + 1 };
        default:
            return current;
    }
}

const destroyWall = (cellA: CoordPair, dir: Direction, mapCells: Direction[][]) => {
    const cellB = getAdjacentCell(cellA, dir);
    mapCells[cellA.y][cellA.x] = dir | mapCells[cellA.y][cellA.x];
    mapCells[cellB.y][cellB.x] = DirectionUtils.getOpposite(dir) | mapCells[cellB.y][cellB.x];
}

